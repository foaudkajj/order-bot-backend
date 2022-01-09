import {HttpStatus, Injectable} from '@nestjs/common';
import {DevextremeLoadOptionsService} from 'src/db/helpers/devextreme-loadoptions';
import {Order} from 'src/db/models/order';
import {Customer} from 'src/db/models/customer';
import {DataSourceLoadOptionsBase} from 'src/panel/dtos/devextreme-query';
import {UIResponseBase} from 'src/panel/dtos/ui-response-base';
import {FindManyOptions, QueryFailedError, Repository} from 'typeorm';
import {InformationMessages} from 'src/bot/helpers/informtaion-msgs';
import {OrderChannel, OrderStatus} from 'src/db/models';
import {InjectRepository} from '@nestjs/typeorm';
import {
  DeliveryType,
  GetirResult,
} from '../../entegrations-management/getir/getir.enums';
import {GetirService} from '../../entegrations-management/getir/getir.service';

@Injectable()
export class OrderService {
  constructor(
    private devextremeLoadOptions: DevextremeLoadOptionsService,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    private getirService: GetirService,
  ) {}

  orderStatusList = [
    {Value: 2, Text: 'ORDER.MERCHANT_CONFIRMED'},
    {Value: 3, Text: 'ORDER.PREPARING'},
    {Value: 4, Text: 'ORDER.SENT'},
    {Value: 5, Text: 'ORDER.DELIVERED'},
  ];

  getirOrderStatusList = [
    {Value: 2, Text: 'ORDER.MERCHANT_CONFIRMED'},
    {Value: 3, Text: 'ORDER.PREPARING'},
    {Value: 4, Text: 'ORDER.HANDOVER'},
    {Value: 5, Text: 'ORDER.DELIVERED'},
  ];

  async Get(query: DataSourceLoadOptionsBase, merchantId: number) {
    const findOptions: FindManyOptions<Order> = this.devextremeLoadOptions.GetFindOptionsFromQuery(
      query,
    );
    findOptions.relations = [
      'customer',
      'getirOrder',
      'orderItems',
      'orderItems.product',
      'orderItems.orderOptions',
      'orderItems.orderOptions.option',
    ];

    // eslint-disable-next-line dot-notation
    findOptions.where['merchantId'] = merchantId;
    const orders: Order[] = await this.orderRepository.find(findOptions);

    const response: UIResponseBase<Order> = {
      IsError: false,
      data: orders,
      totalCount: orders.length,
      MessageKey: 'SUCCESS',
      StatusCode: 200,
    };
    return response;
  }

  async Insert(MerchantId: number, entity: Order) {
    try {
      const response: UIResponseBase<Order> = {
        IsError: false,
        Result: entity,
        MessageKey: 'SUCCESS',
        StatusCode: 200,
      };
      console.log(entity);
      if (entity.customer) {
        // Address: entity.customer.Address, FirstName: entity.customer.FirstName,LastName: entity.customer.LastName,Location: entity.customer.Location,, Username: entity.customer.Username
        const NewCustomer: Customer = {
          merchantId: MerchantId,
          customerChannel: OrderChannel.Panel,
          phoneNumber: entity.customer.phoneNumber,
          fullName: entity.customer.fullName,
        };
        entity.customer = NewCustomer;
      }
      if (!entity.orderNo) entity.orderNo = new Date().valueOf().toString();
      entity.createDate = new Date();

      console.log(entity);
      await this.orderRepository.insert(entity);
      return response;
    } catch (error) {
      console.log((error as QueryFailedError).message);
      const err = <UIResponseBase<Order>>{
        IsError: true,
        MessageKey: 'ERROR',
        StatusCode: 500,
      };
      throw new Error(JSON.stringify(err));
    }
  }

  async Update(updateDetails: Order) {
    try {
      const order = await this.orderRepository.findOne({
        where: {id: updateDetails.id},
        relations: ['getirOrder', 'merchant', 'customer'],
      });

      if (order.orderChannel === OrderChannel.Getir) {
        if (updateDetails.orderStatus === OrderStatus.Delivered) {
          let response: GetirResult;
          if (order.getirOrder.deliveryType === DeliveryType.ByGetir) {
            response = await this.getirService.handoverOrder(
              order.getirOrder.id,
              order.merchant.Id,
            );
          } else if (
            order.getirOrder.deliveryType === DeliveryType.ByRestaurant
          ) {
            response = await this.getirService.deliverOrder(
              order.getirOrder.id,
              order.merchant.Id,
            );
          }

          if (response.result === true) {
            await this.orderRepository.update({id: order.id}, updateDetails);
            return <UIResponseBase<Order>>{
              IsError: false,
              Result: updateDetails,
              MessageKey: 'SUCCESS',
              StatusCode: 200,
            };
          } else {
            const error = <UIResponseBase<Order>>{
              IsError: true,
              Result: updateDetails,
              MessageKey: 'Getir service error',
              StatusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            };
            throw new Error(JSON.stringify(error));
          }
        } else {
          let response: GetirResult;
          if (updateDetails.orderStatus === OrderStatus.FutureOrder) {
            response = await this.getirService.verifyFutureOrder(
              order.getirOrder.id,
              order.merchant.Id,
            );

            updateDetails.orderStatus =
              response?.result === true
                ? OrderStatus.New
                : updateDetails.orderStatus;
          } else if (updateDetails.orderStatus === OrderStatus.Preparing) {
            response = await this.getirService.prepareOrder(
              order.getirOrder.id,
              order.merchant.Id,
            );
          } else if (
            updateDetails.orderStatus === OrderStatus.MerchantConfirmed
          ) {
            response = await this.getirService.verifyOrder(
              order.getirOrder.id,
              order.merchant.Id,
            );
          }

          if (response.result === true) {
            await this.orderRepository.update({id: order.id}, updateDetails);
          } else {
            const error = <UIResponseBase<Order>>{
              IsError: true,
              Result: updateDetails,
              MessageKey: 'Getir service error',
              StatusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            };
            throw new Error(JSON.stringify(error));
          }
        }
      } else if (order.orderChannel === OrderChannel.Telegram) {
        await this.orderRepository.update({id: order.id}, updateDetails);

        switch (updateDetails.orderStatus) {
          case OrderStatus.MerchantConfirmed:
            InformationMessages.SendInformationMessage(
              order.merchant.botUserName,
              order.customer.telegramId,
              'Siparişiniz Onaylandı',
            );
            break;
          case OrderStatus.Preparing:
            InformationMessages.SendInformationMessage(
              order.merchant.botUserName,
              order.customer.telegramId,
              'Siparişiniz Hazırlanıyor',
            );
            break;
          case OrderStatus.OrderSent:
            InformationMessages.SendInformationMessage(
              order.merchant.botUserName,
              order.customer.telegramId,
              'Siparişiniz Yola Çıkmıştır',
            );
            break;
          case OrderStatus.Delivered:
            InformationMessages.SendInformationMessage(
              order.merchant.botUserName,
              order.customer.telegramId,
              'Siparişiniz Size Teslim Edilmiştir',
            );
            break;
          default:
            break;
        }
      }

      return <UIResponseBase<Order>>{
        IsError: false,
        Result: updateDetails,
        MessageKey: 'SUCCESS',
        StatusCode: 200,
      };
    } catch (error) {
      console.log(error);
      const err = <UIResponseBase<Order>>{
        IsError: true,
        MessageKey: 'ERROR',
        StatusCode: 500,
      };
      throw new Error(JSON.stringify(err));
    }
  }

  async Delete(Id: number, merchantId: number) {
    try {
      await this.orderRepository.delete({id: Id, merchantId: merchantId});
      return <UIResponseBase<Order>>{
        IsError: false,
        MessageKey: 'SUCCESS',
        StatusCode: 200,
      };
    } catch (error) {
      console.log(error);
      const err = <UIResponseBase<Order>>{
        IsError: true,
        MessageKey: 'ERROR',
        StatusCode: 500,
      };
      throw new Error(JSON.stringify(err));
    }
  }

  async CancelOrder(orderId: string) {
    try {
      const order = await this.orderRepository.findOne({
        where: {id: orderId},
        relations: ['getirOrder', 'merchant', 'customer'],
      });

      if (order.orderChannel === OrderChannel.Telegram) {
        await this.orderRepository.update(orderId, {
          orderStatus: OrderStatus.Canceled,
        });

        InformationMessages.SendInformationMessage(
          order.merchant.botUserName,
          order.customer.telegramId,
          'Siparişiniz İptal Edilmiştir.',
        );
      } else if (order.orderChannel === OrderChannel.Getir) {
        const response = await this.getirService.cancelOrder(
          order.getirOrder.id,
          order.merchantId,
        );

        if (response.result === true) {
          await this.orderRepository.update(orderId, {
            orderStatus: OrderStatus.Canceled,
          });
        } else {
          const error = <UIResponseBase<Order>>{
            IsError: true,
            MessageKey: 'Getir service error',
            StatusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          };
          throw new Error(JSON.stringify(error));
        }
      }
    } catch (error) {
      console.log(error);
      const err = <UIResponseBase<Order>>{
        IsError: true,
        MessageKey: 'ERROR',
        StatusCode: 500,
      };
      throw new Error(JSON.stringify(err));
    }
  }
}
