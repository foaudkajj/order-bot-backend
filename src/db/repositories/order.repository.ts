import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {OrderStatus} from 'src/models';
import {Order} from 'src/models/order';
import {FindOptionsRelations, Repository} from 'typeorm';
import {BotContext} from '../../bot/interfaces/bot-context';
import {BaseRepository} from './base.repository';
import {CustomerRepository} from './customer.repository';

@Injectable()
export class OrderRepository extends BaseRepository<Order> {
  constructor(
    @InjectRepository(Order)
    private _: Repository<Order>,
    private customerRepository: CustomerRepository,
  ) {
    super();
    this.orm = _;
  }
  async getOrdersInBasketByStatus(
    ctx: BotContext,
    orderStatus: OrderStatus,
    relations?: FindOptionsRelations<Order>,
  ) {
    // const userInfo = ctx.from.is_bot ? ctx.callbackQuery.from : ctx.from;
    const customer = await this.customerRepository.getCustomerByTelegramId(ctx);
    const order = await this.orm.findOne({
      where: {customerId: customer.id, orderStatus: orderStatus},
      relations: relations,
      order: {createDate: 'DESC'},
    });
    return order;
  }

  async getOrderInBasketByTelegramId(
    ctx: BotContext,
    relations?: FindOptionsRelations<Order>,
  ) {
    // const userInfo = ctx.from.is_bot ? ctx.callbackQuery.from : ctx.from;
    const customer = await this.customerRepository.getCustomerByTelegramId(ctx);
    if (relations) {
      return await this.orm.findOne({
        where: {customerId: customer.id, orderStatus: OrderStatus.New},
        relations: relations,
      });
    } else {
      return await this.orm.findOne({
        where: {customerId: customer.id, orderStatus: OrderStatus.New},
      });
    }
  }
}
