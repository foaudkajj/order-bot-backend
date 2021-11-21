import {Customer} from 'src/DB/models/customer';
import {EntityRepository, Repository} from 'typeorm';
import {BotContext} from '../interfaces/BotContext';

@EntityRepository(Customer)
export class CustomerRepository extends Repository<Customer> {
  async getCustomerByTelegramId(ctx: BotContext, relations?: string[]) {
    const userInfo = ctx.from.is_bot ? ctx.callbackQuery.from : ctx.from;
    if (relations && relations.length > 0) {
      return await this.findOne({
        where: {TelegramId: userInfo.id, relations: relations},
      });
    } else {
      return await this.findOne({where: {TelegramId: userInfo.id}});
    }
  }
}
