import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Customer} from 'src/models/customer';
import {FindOptionsRelations, Repository} from 'typeorm';
import {BotContext} from '../../bot/interfaces/bot-context';
import {BaseRepository} from './base.repository';

@Injectable()
export class CustomerRepository extends BaseRepository<Customer> {
  constructor(
    @InjectRepository(Customer)
    private _: Repository<Customer>,
  ) {
    super();
    this.orm = _;
  }

  async getCurrentCustomer(
    ctx: BotContext,
    relations: FindOptionsRelations<Customer> = undefined,
  ) {
    if (relations && !relations?.merchant) {
      relations.merchant = true;
    }

    const userInfo = ctx.from.is_bot ? ctx.callbackQuery.from : ctx.from;
    return this.orm.findOne({
      where: {
        telegramId: ctx.botUser?.id ?? userInfo.id,
        merchant: {botUserName: ctx.botInfo.username},
      },
      relations: relations ?? {},
    });
  }
}
