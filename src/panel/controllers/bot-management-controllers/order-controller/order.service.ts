import { Injectable } from '@nestjs/common';
import { OrderStatus } from 'src/DB/enums/OrderStatus';
import { DevextremeLoadOptionsService } from 'src/DB/Helpers/devextreme-loadoptions';
import { Order } from 'src/DB/models/Order';
import { Customer } from 'src/DB/models/Customer';
import {
  DataSourceLoadOptionsBase
} from 'src/panel/dtos/DevextremeQuery';
import { UIResponseBase } from 'src/panel/dtos/UIResponseBase';
import { FindManyOptions, getRepository, QueryFailedError } from 'typeorm';
import { InformationMessages } from 'src/bot/helpers/informtaion-msgs';
import { OrderChannel } from 'src/DB/enums/OrderChannel';

@Injectable()
export class OrderService {
  constructor (private devextremeLoadOptions: DevextremeLoadOptionsService) {}

  items = [
    { Value: 2, Text: 'ORDER.MERCHANT_CONFIRMED' },
    { Value: 3, Text: 'ORDER.BEING_PREPARING' },
    { Value: 4, Text: 'ORDER.SENT' },
    { Value: 5, Text: 'ORDER.DELIVERED' }
  ];

  async Get (query: DataSourceLoadOptionsBase) {
    let entities: Order[];
    const findOptions: FindManyOptions<Order> = this.devextremeLoadOptions.GetFindOptionsFromQuery(
      query
    );
    findOptions.relations = [
      'customer',
      'TelegramOrder',
      'GetirOrder',
      'orderItems',
      'orderItems.Product'
    ];
    entities = await getRepository(Order).find(findOptions);
    entities = entities.map(order => {
      if (order.OrderStatus != OrderStatus.Canceled) {
        order.OperationItems = this.items.filter(
          fi => fi.Value > order.OrderStatus
        );
        if (order.OrderStatus != OrderStatus.Delivered) {
          order.OperationItems.push({ Value: 6, Text: 'ORDER.CANCELED' });
        }
      }

      return order;
    });
    const response: UIResponseBase<Order> = {
      IsError: false,
      data: entities,
      totalCount: entities.length,
      MessageKey: 'SUCCESS',
      StatusCode: 200
    };
    return response;
  }

  async Insert (entity: Order) {
    try {
      const response: UIResponseBase<Order> = {
        IsError: false,
        Result: entity,
        MessageKey: 'SUCCESS',
        StatusCode: 200
      };
      console.log(entity);
      if (entity.customer) {
        // Address: entity.customer.Address, FirstName: entity.customer.FirstName,LastName: entity.customer.LastName,Location: entity.customer.Location,, Username: entity.customer.Username
        const NewCustomer: Customer = {
          CustomerChannel: OrderChannel.Panel,
          PhoneNumber: entity.customer.PhoneNumber,
          FullName: entity.customer.FullName
        };
        entity.customer = NewCustomer;
      }
      if (!entity.OrderNo) entity.OrderNo = new Date().valueOf().toString();
      entity.CreateDate = new Date();

      console.log(entity);
      await getRepository(Order).insert(entity);
      return response;
    } catch (error) {
      console.log((error as QueryFailedError).message);
      throw <UIResponseBase<Order>>{
        IsError: true,
        MessageKey: 'ERROR',
        StatusCode: 500
      };
    }
  }

  async Update (updateDetails: Order) {
    try {
      const entity = await getRepository(Order).findOne({
        where: { Id: updateDetails.Id }
      });
      const { Id, customer, ...updatedEntity } = { ...entity, ...updateDetails };

      const userEntity: Order = await getRepository(Order).findOne(
        { Id: entity.Id },
        { relations: ['customer'] }
      );
      if (customer) {
        await getRepository(Customer).update(
          { Id: userEntity.customer.Id },
          customer
        );
      }

      if (updateDetails.OrderStatus) {
        switch (updateDetails.OrderStatus) {
          case OrderStatus.MerchantConfirmed:
            InformationMessages.SendInformationMessage(
              userEntity.customer.TelegramId,
              'Siparişiniz Onaylandı'
            );
            break;
          case OrderStatus.Preparing:
            InformationMessages.SendInformationMessage(
              userEntity.customer.TelegramId,
              'Siparişiniz Hazırlanıyor'
            );
            break;
          case OrderStatus.OrderSent:
            InformationMessages.SendInformationMessage(
              userEntity.customer.TelegramId,
              'Siparişiniz Yola Çıkmıştır'
            );
            break;
          case OrderStatus.Delivered:
            InformationMessages.SendInformationMessage(
              userEntity.customer.TelegramId,
              'Siparişiniz Size Teslim Edilmiştir'
            );
            break;
          default:
            break;
        }
      }

      await getRepository(Order).update({ Id: entity.Id }, updatedEntity);
      return <UIResponseBase<Order>>{
        IsError: false,
        Result: updatedEntity,
        MessageKey: 'SUCCESS',
        StatusCode: 200
      };
    } catch (error) {
      console.log(error);
      throw <UIResponseBase<Order>>{
        IsError: true,
        MessageKey: 'ERROR',
        StatusCode: 500
      };
    }
  }

  async Delete (Id: number) {
    try {
      await getRepository(Order).delete({ Id: Id });
      return <UIResponseBase<Order>>{
        IsError: false,
        MessageKey: 'SUCCESS',
        StatusCode: 200
      };
    } catch (error) {
      console.log(error);
      throw <UIResponseBase<Order>>{
        IsError: true,
        MessageKey: 'ERROR',
        StatusCode: 500
      };
    }
  }
}
