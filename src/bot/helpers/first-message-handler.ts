import { TelegramUser } from "src/DB/models/TelegramUser";
import { getCustomRepository } from "typeorm";
import { UserRepository } from "../custom-repositories/UserRepository";
import { BotContext } from "../interfaces/BotContext";
import { CallBackQueryResult } from "../models/CallBackQueryResult";

export abstract class FirstMessageHandler {

    static async startOptions(ctx: BotContext, messageToShow: null | string = null) {
        await this.createNewUserIfUserDoesnitExist(ctx);
        if (ctx.updateType === 'message') {
            return await ctx.reply(messageToShow ?? 'Hoş Geldiniz , \n Sipariş vermeniz için ben size yardımcı olacağım.',
                {
                    reply_markup: {
                        one_time_keyboard: true,
                        inline_keyboard:
                            [
                                [{ text: "🥘 Sipariş Ver 🥘", callback_data: CallBackQueryResult.StartOrdering }],
                                [{ text: "🚚 Siparişini Takip Et 🚚", callback_data: CallBackQueryResult.GetConfirmedOrders }],
                                [{ text: "🗑 Sepetem 🗑", callback_data: CallBackQueryResult.MyBasket }],
                                [{ text: "🗑 Sepetemi Boşalt 🗑", callback_data: CallBackQueryResult.EmptyBakset }],
                                [{ text: "✔️ Siparişimi Tamamla ✔️", callback_data: CallBackQueryResult.CompleteOrder }],
                            ]
                    }
                })
        } else {
            return await ctx.editMessageText(messageToShow ?? 'Hoş Geldiniz , \n Sipariş vermeniz için ben size yardımcı olacağım.',
                {
                    reply_markup: {
                        // one_time_keyboard: true,
                        inline_keyboard:
                            [
                                [{ text: "🥘 Sipariş Ver 🥘", callback_data: CallBackQueryResult.StartOrdering }],
                                [{ text: "🚚 Siparişini Takip Et 🚚", callback_data: CallBackQueryResult.GetConfirmedOrders }],
                                [{ text: "🗑 Sepetem 🗑", callback_data: CallBackQueryResult.MyBasket }],
                                [{ text: "🗑 Sepetemi Boşalt 🗑", callback_data: CallBackQueryResult.EmptyBakset }],
                                [{ text: "✔️ Siparişimi Tamamla ✔️", callback_data: CallBackQueryResult.CompleteOrder }],
                            ]
                    }
                })
        }

    }

    private static async createNewUserIfUserDoesnitExist(ctx: BotContext) {
        const userRepository = getCustomRepository(UserRepository);
        const user = await userRepository.findOne(ctx.from.id);
        if (!user) {
            const newUser: TelegramUser = { Id: ctx.from.id, FirstName: ctx.from.first_name, LastName: ctx.from.last_name, Username: ctx.from.username };
            await userRepository.save(newUser);
        }

    }

}