import {Injectable} from '@nestjs/common';
import {DevextremeLoadOptionsService} from 'src/db/helpers/devextreme-loadoptions';
import {Order} from 'src/db/models/order';
import {Customer} from 'src/db/models/customer';
import {DataSourceLoadOptionsBase} from 'src/panel/dtos/devextreme-query';
import {UIResponseBase} from 'src/panel/dtos/ui-response-base';
import {FindManyOptions, QueryFailedError, Repository} from 'typeorm';
import {InformationMessages} from 'src/bot/helpers/informtaion-msgs';
import {OrderChannel, OrderStatus} from 'src/db/models';
import {InjectRepository} from '@nestjs/typeorm';

@Injectable()
export class OrderService {
  constructor(
    private devextremeLoadOptions: DevextremeLoadOptionsService,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  items = [
    {Value: 2, Text: 'ORDER.MERCHANT_CONFIRMED'},
    {Value: 3, Text: 'ORDER.BEING_PREPARING'},
    {Value: 4, Text: 'ORDER.SENT'},
    {Value: 5, Text: 'ORDER.DELIVERED'},
  ];

  async Get(query: DataSourceLoadOptionsBase, merchantId: number) {
    let entities: Order[];
    const findOptions: FindManyOptions<Order> = this.devextremeLoadOptions.GetFindOptionsFromQuery(
      query,
    );
    findOptions.relations = [
      'customer',
      'TelegramOrder',
      'GetirOrder',
      'orderItems',
      'orderItems.Product',
    ];

    findOptions.where = {merchantId: merchantId};
    entities = await this.orderRepository.find(findOptions);
    entities = entities.map(order => {
      if (order.OrderStatus !== OrderStatus.Canceled) {
        order.OperationItems = this.items.filter(
          fi => fi.Value > order.OrderStatus,
        );
        if (order.OrderStatus !== OrderStatus.Delivered) {
          order.OperationItems.push({Value: 6, Text: 'ORDER.CANCELED'});
        }
      }

      return order;
    });
    const response: UIResponseBase<Order> = {
      IsError: false,
      data: entities,
      totalCount: entities.length,
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
          CustomerChannel: OrderChannel.Panel,
          PhoneNumber: entity.customer.PhoneNumber,
          FullName: entity.customer.FullName,
        };
        entity.customer = NewCustomer;
      }
      if (!entity.OrderNo) entity.OrderNo = new Date().valueOf().toString();
      entity.CreateDate = new Date();

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
      const entity = await this.orderRepository.findOne({
        where: {Id: updateDetails.Id},
      });
      const {Id, customer, ...updatedEntity} = {...entity, ...updateDetails};

      const userEntity: Order = await this.orderRepository.findOne(
        {Id: entity.Id},
        {relations: ['customer']},
      );
      if (customer) {
        await this.customerRepository.update(
          {Id: userEntity.customer.Id},
          customer,
        );
      }

      if (updateDetails.OrderStatus) {
        switch (updateDetails.OrderStatus) {
          case OrderStatus.MerchantConfirmed:
            InformationMessages.SendInformationMessage(
              userEntity.customer.TelegramId,
              'Siparişiniz Onaylandı',
            );
            break;
          case OrderStatus.Preparing:
            InformationMessages.SendInformationMessage(
              userEntity.customer.TelegramId,
              'Siparişiniz Hazırlanıyor',
            );
            break;
          case OrderStatus.OrderSent:
            InformationMessages.SendInformationMessage(
              userEntity.customer.TelegramId,
              'Siparişiniz Yola Çıkmıştır',
            );
            break;
          case OrderStatus.Delivered:
            InformationMessages.SendInformationMessage(
              userEntity.customer.TelegramId,
              'Siparişiniz Size Teslim Edilmiştir',
            );
            break;
          default:
            break;
        }
      }

      await this.orderRepository.update({Id: entity.Id}, updatedEntity);
      return <UIResponseBase<Order>>{
        IsError: false,
        Result: updatedEntity,
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
      await this.orderRepository.delete({Id: Id, merchantId: merchantId});
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
}
