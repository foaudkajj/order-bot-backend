import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {Order} from 'src/models/order';
import {Customer} from 'src/models/customer';
import {DataSourceLoadOptionsBase} from 'src/panel/dtos/devextreme-query';
import {UIResponseBase} from 'src/panel/dtos/ui-response-base';
import {FindManyOptions, Not} from 'typeorm';
import {InformationMessages} from 'src/bot/helpers/informtaion-msgs';
import {OrderChannel, OrderStatus} from 'src/models';
import {
  DeliveryType,
  GetirResult,
} from '../../entegrations-management/getir/getir.enums';
import {GetirService} from '../../entegrations-management/getir/getir.service';
import {OrderRepository} from 'src/db/repositories';
import {DevextremeService} from 'src/services/devextreme.service';
import {CancelOrderRequest} from 'src/panel/dtos';

@Injectable()
export class OrderService {
  constructor(
    private devextremeLoadOptions: DevextremeService,
    private orderRepository: OrderRepository,
    private getirService: GetirService,
    private informationMessages: InformationMessages,
  ) {}

  async get(query: DataSourceLoadOptionsBase, merchantId: number) {
    const findOptions: FindManyOptions<Order> = {};
    findOptions.relations = [
      'customer',
      'getirOrder',
      'orderItems',
      'orderItems.product',
      'orderItems.orderOptions',
      'orderItems.orderOptions.option',
    ];

    findOptions.where = {
      orderStatus: Not(OrderStatus.New),
      merchantId: merchantId,
    };
    const orders: Order[] = await this.orderRepository.orm.find(findOptions);

    const response: UIResponseBase<Order[]> = {
      data: orders,
      totalCount: orders.length,
    };
    return response;
  }

  async insert(MerchantId: number, entity: Order) {
    const response: UIResponseBase<Order> = {
      data: entity,
    };
    if (entity.customer) {
      // Address: entity.customer.Address, FirstName: entity.customer.FirstName,LastName: entity.customer.LastName,Location: entity.customer.Location,, Username: entity.customer.Username
      const newCustomer: Customer = {
        merchantId: MerchantId,
        customerChannel: OrderChannel.Panel,
        phoneNumber: entity.customer.phoneNumber,
        fullName: entity.customer.fullName,
        createDate: new Date(),
      };
      entity.customer = newCustomer;
    }
    if (!entity.orderNo) entity.orderNo = new Date().getTime().toString(36);
    entity.createDate = new Date();

    await this.orderRepository.orm.insert(entity);
    return response;
  }

  async update(updateDetails: Order) {
    const order = await this.orderRepository.orm.findOne({
      where: {id: updateDetails.id},
      relations: {getirOrder: true, merchant: true, customer: true},
    });

    if (order.orderChannel === OrderChannel.Getir) {
      let response: GetirResult;
      if (updateDetails.orderStatus === OrderStatus.Delivered) {
        if (order.getirOrder.deliveryType === DeliveryType.ByGetir) {
          response = await this.getirService.handoverOrder(
            order.getirOrder.id,
            order.merchant.id,
          );
        } else if (
          order.getirOrder.deliveryType === DeliveryType.ByRestaurant
        ) {
          response = await this.getirService.deliverOrder(
            order.getirOrder.id,
            order.merchant.id,
          );
        }

        if (response.result === true) {
          await this.orderRepository.orm.update({id: order.id}, updateDetails);
          return <UIResponseBase<Order>>{
            data: updateDetails,
          };
        }
      } else {
        if (updateDetails.orderStatus === OrderStatus.FutureOrder) {
          response = await this.getirService.verifyFutureOrder(
            order.getirOrder.id,
            order.merchant.id,
          );

          updateDetails.orderStatus =
            response?.result === true
              ? OrderStatus.ConfirmedFutureOrder
              : updateDetails.orderStatus;
        } else if (updateDetails.orderStatus === OrderStatus.Prepared) {
          response = await this.getirService.prepareOrder(
            order.getirOrder.id,
            order.merchant.id,
          );
        } else if (
          updateDetails.orderStatus === OrderStatus.MerchantConfirmed
        ) {
          response = await this.getirService.verifyOrder(
            order.getirOrder.id,
            order.merchant.id,
          );
        }

        if (response.result === true) {
          await this.orderRepository.orm.update({id: order.id}, updateDetails);
        }
      }
      if (response.result === false) {
        switch (updateDetails.orderStatus) {
          case OrderStatus.Prepared:
            if (response.code === 74) {
              throw new HttpException(
                'GETIR.ERRORS.FAST_PREPARE',
                response.code,
              );
            }
            break;

          case OrderStatus.Delivered:
            if (response.code === 62) {
              throw new HttpException(
                'GETIR.ERRORS.FAST_DELIVER',
                response.code,
              );
            }
            break;

          default:
            throw new HttpException(
              'GETIR.ERRORS.GENERAL_ERROR',
              response.code,
            );
        }
      }
    } else if (order.orderChannel === OrderChannel.Telegram) {
      await this.orderRepository.orm.update({id: order.id}, updateDetails);

      switch (updateDetails.orderStatus) {
        case OrderStatus.MerchantConfirmed:
          this.informationMessages.SendInformationMessage(
            order.merchant.botUserName,
            order.customer.telegramId,
            `Siparişiniz Onaylandı. sipariş no: <b>${order.orderNo}</b>`,
          );
          break;
        case OrderStatus.Prepared:
          this.informationMessages.SendInformationMessage(
            order.merchant.botUserName,
            order.customer.telegramId,
            `Siparişiniz Hazır. sipariş no: <b>${order.orderNo}</b>`,
          );
          break;
        case OrderStatus.OrderSent:
          this.informationMessages.SendInformationMessage(
            order.merchant.botUserName,
            order.customer.telegramId,
            `Siparişiniz Yola Çıkmıştır. sipariş no: <b>${order.orderNo}</b>`,
          );
          break;
        case OrderStatus.Delivered:
          this.informationMessages.SendInformationMessage(
            order.merchant.botUserName,
            order.customer.telegramId,
            `Siparişiniz Size Teslim Edilmiştir. sipariş no: <b>${order.orderNo}</b>`,
          );
          break;
        default:
          break;
      }
    }

    return <UIResponseBase<Order>>{
      data: updateDetails,
    };
  }

  async delete(Id: number, merchantId: number) {
    await this.orderRepository.orm.delete({id: Id, merchantId: merchantId});
  }

  async cancelOrder(cancelOrder: CancelOrderRequest, merchantId: number) {
    const orderId = cancelOrder.orderId;
    const order = await this.orderRepository.orm.findOne({
      where: {id: orderId, merchantId: merchantId},
      relations: {getirOrder: true, merchant: true, customer: true},
    });

    if (order.orderChannel === OrderChannel.Telegram) {
      await this.orderRepository.orm.update(orderId, {
        orderStatus: OrderStatus.Canceled,
        cancelReason: cancelOrder.cancelReason,
      });

      if (!cancelOrder.cancelReason) {
        cancelOrder.cancelReason = 'Belirtilmemiş';
      }

      this.informationMessages.SendInformationMessage(
        order.merchant.botUserName,
        order.customer.telegramId,
        `Siparişiniz İptal Edilmiştir.\nSipariş No: ${order.orderNo}.\nSebep: <b>${cancelOrder.cancelReason}.</b>`,
      );
    } else if (order.orderChannel === OrderChannel.Getir) {
      const response = await this.getirService.cancelOrder(
        order.getirOrder.id,
        order.merchantId,
      );

      if (response.result === true) {
        await this.orderRepository.orm.update(orderId, {
          orderStatus: OrderStatus.Canceled,
          cancelReason: cancelOrder.cancelReason,
        });
      } else {
        throw new HttpException(
          'GETIR.ERRORS.SERVICE_ERROR',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
