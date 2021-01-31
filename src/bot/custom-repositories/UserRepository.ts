import { TelegramUser } from "src/DB/models/TelegramUser";
import { EntityRepository, Repository } from "typeorm";
import { BotContext } from "../interfaces/BotContext";

@EntityRepository(TelegramUser)
export class UserRepository extends Repository<TelegramUser> {

    async getUser(ctx: BotContext, relations?: string[]) {
        const userInfo = ctx.from.is_bot ? ctx.callbackQuery.from : ctx.from;
        if (relations && relations.length > 0) {
            return await this.findOne(userInfo.id, { relations: relations });
        } else
            return await this.findOne(userInfo.id);
    }

}