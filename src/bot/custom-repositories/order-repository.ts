import {OrderStatus} from 'src/db/models';
import {Order} from 'src/db/models/order';
import {EntityRepository, getCustomRepository, Repository} from 'typeorm';
import {BotContext} from '../interfaces/bot-context';
import {CustomerRepository} from './customer-repository';

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
      where: {customerId: customer.id, orderStatus: orderStatus},
      relations: relations,
      order: {createDate: 'DESC'},
    });
    return order;
  }

  async getOrderInBasketByTelegramId(ctx: BotContext, relations?: string[]) {
    const customerRepository = getCustomRepository(CustomerRepository);
    // const userInfo = ctx.from.is_bot ? ctx.callbackQuery.from : ctx.from;
    const customer = await customerRepository.getCustomerByTelegramId(ctx);
    if (relations && relations.length > 0) {
      return await this.findOne({
        where: {customerId: customer.id, orderStatus: OrderStatus.New},
        relations: relations,
      });
    } else {
      return await this.findOne({
        where: {customerId: customer.id, orderStatus: OrderStatus.New},
      });
    }
  }
}
