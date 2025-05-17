import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {OrderStatus} from 'src/models';
import {Order} from 'src/models/order';
import {FindOptionsRelations, In, Not, Repository} from 'typeorm';
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

  /**
   * Returns the current order of the current customer(user) account.
   * Each customer has only one active (New) order.
   * @param ctx the bot context
   * @param relations the relations
   * @returns {Promise<Order>} the current order
   */
  async getCurrentOrder(
    ctx: BotContext,
    relations?: FindOptionsRelations<Order>,
  ): Promise<Order> {
    const customer = await this.customerRepository.getCurrentCustomer(ctx);

    return await this.orm.findOne({
      where: {customerId: customer.id, orderStatus: OrderStatus.New},
      relations: relations ?? {},
      order: {createDate: 'DESC'},
    });
  }

  /**
   * Returns the active orders (which have not resulted yet) of the current customer (user) account.
   * A user can have only one new order and multiple active orders.
   * The active orders are the orders with status that is NOT New, delivered, or cancelled.
   * It is possible to have multiple active orders by submitting one after another.
   * @param ctx the bot context
   * @param relations the relations
   * @returns {Promise<Order[]>} the active orders
   */
  async getActiveOrders(
    ctx: BotContext,
    relations?: FindOptionsRelations<Order>,
  ): Promise<Order[]> {
    const customer = await this.customerRepository.getCurrentCustomer(ctx);

    return await this.orm.find({
      where: {
        customerId: customer.id,
        orderStatus: Not(In([OrderStatus.Delivered, OrderStatus.Canceled])),
      },
      relations: relations ?? {},
      order: {createDate: 'DESC'},
    });
  }

  /**
   * Checks if the current customer(user) has an active order.
   * @param {BotContext} ctx the bot context
   * @returns {boolean} true if the customer(user) has an active order.
   */
  async hasActiveOrder(ctx: BotContext): Promise<boolean> {
    const customer = await this.customerRepository.getCurrentCustomer(ctx);
    return this.orm.existsBy({
      customerId: customer.id,
      orderStatus: OrderStatus.New,
    });
  }
}
