import {OrderStatus} from 'src/DB/enums/OrderStatus';
import {Order} from 'src/DB/models/Order';
import {
  EntityRepository,
  getCustomRepository,
  getRepository,
  Repository,
} from 'typeorm';
import {BotContext} from '../interfaces/BotContext';
import {CustomerRepository} from './CustomerRepository';

@EntityRepository(Order)
export class OrderRepository extends Repository<Order> {
  async getOrdersInBasketByStatus(
    ctx: BotContext,
    orderStatus: OrderStatus,
    relations?: string[],
  ) {
    const customerRepository = getCustomRepository(CustomerRepository);
    // const userInfo = ctx.from.is_bot ? ctx.callbackQuery.from : ctx.from;
    const customer = await customerRepository.getCustomerByTelegramId(ctx);
    const order = await this.findOne({
      where: {customerId: customer.Id, OrderStatus: orderStatus},
      relations: relations,
      order: {CreateDate: 'DESC'},
    });
    return order;
  }

  async getOrderInBasketByTelegramId(ctx: BotContext, relations?: string[]) {
    const customerRepository = getCustomRepository(CustomerRepository);
    // const userInfo = ctx.from.is_bot ? ctx.callbackQuery.from : ctx.from;
    const customer = await customerRepository.getCustomerByTelegramId(ctx);
    if (relations && relations.length > 0) {
      return await this.findOne({
        where: {customerId: customer.Id, OrderStatus: OrderStatus.New},
        relations: relations,
      });
    } else {
      return await this.findOne({
        where: {customerId: customer.Id, OrderStatus: OrderStatus.New},
      });
    }
  }
}
