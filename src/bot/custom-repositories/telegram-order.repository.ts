import {TelegramOrder} from 'src/DB/models';
import {EntityRepository, Repository} from 'typeorm';
import {BotContext} from '../interfaces/BotContext';

@EntityRepository(TelegramOrder)
export class TelegramUserRepository extends Repository<TelegramOrder> {
  async getTelegramUserTelegramId(ctx: BotContext, relations?: string[]) {
    const userInfo = ctx.from.is_bot ? ctx.callbackQuery.from : ctx.from;
    if (relations && relations.length > 0) {
      return await this.findOne({
        where: {id: userInfo.id},
      });
    } else {
      return await this.findOne({where: {TelegramId: userInfo.id}});
    }
  }
}
