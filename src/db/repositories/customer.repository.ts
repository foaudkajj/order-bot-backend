import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Customer} from 'src/models/customer';
import {FindOptionsRelations, Repository} from 'typeorm';
import {BotContext} from '../../bot/interfaces/bot-context';
import {BaseRepository} from './base.repository';
import {Equal} from 'typeorm';

@Injectable()
export class CustomerRepository extends BaseRepository<Customer> {
  constructor(
    @InjectRepository(Customer)
    private _: Repository<Customer>,
  ) {
    super();
    this.orm = _;
  }

  async getCustomerByTelegramId(
    ctx: BotContext,
    relations: FindOptionsRelations<Customer> = undefined,
  ) {
    const userInfo = ctx.from.is_bot ? ctx.callbackQuery.from : ctx.from;

    if (relations && !relations?.merchant) {
      relations.merchant = true;
    }
    if (relations) {
      return await this.orm.findOne({
        where: {
          telegramId: userInfo.id,
          merchant: {botUserName: ctx.botInfo.username},
        },
        relations: relations,
      });
    } else {
      return await this.orm.findOne({
        relations: {merchant: true},
        where: {
          telegramId: userInfo.id,
          merchant: {botUserName: ctx.botInfo.username},
        },
      });
    }
  }

  async getCustomerOrdersInBasket(ctx: BotContext) {
    const userInfo = ctx.from.is_bot ? ctx.callbackQuery.from : ctx.from;
    return await this.orm.findOne({
      where: {
        telegramId: userInfo.id,
        merchant: {botUserName: ctx.botInfo.username},
      },
      relations: {orders: {orderItems: true}, merchant: true},
    });
  }
}
