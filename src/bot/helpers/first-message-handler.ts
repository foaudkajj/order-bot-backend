import { OrderChannel as Channel } from "src/DB/enums/OrderChannel";
import { Customer } from "src/DB/models/Customer";
import { InlineKeyboardButton } from "telegraf/typings/telegram-types";
import { getCustomRepository } from "typeorm";
import { CustomerRepository } from "../custom-repositories/CustomerRepository";
import { BotContext } from "../interfaces/BotContext";
import { CallBackQueryResult } from "../models/CallBackQueryResult";

export abstract class FirstMessageHandler {

    static async startOptions(ctx: BotContext, messageToShow: null | string = null) {
        const inline_keyboard:InlineKeyboardButton[][]= [
            [{ text: "🥘 Sipariş Ver 🥘", callback_data: CallBackQueryResult.StartOrdering }],
            [{ text: "🚚 Siparişini Takip Et 🚚", callback_data: CallBackQueryResult.GetConfirmedOrders }],
            [{ text: "🗑 Sepetem 🗑", callback_data: CallBackQueryResult.MyBasket }],
            [{ text: "🗑 Sepetemi Boşalt 🗑", callback_data: CallBackQueryResult.EmptyBakset }],
            [{ text: "✔️ Siparişimi Tamamla ✔️", callback_data: CallBackQueryResult.CompleteOrder }],
        ];
        await this.createNewUserIfUserDoesnitExist(ctx);
        if (ctx.updateType === 'message') {
            return await ctx.reply(messageToShow ?? 'Hoş Geldiniz , \n Sipariş vermeniz için ben size yardımcı olacağım.',
                {
                    reply_markup: {
                        one_time_keyboard: true,
                        inline_keyboard:
                            inline_keyboard
                    }
                })
        } else {
            return await ctx.editMessageText(messageToShow ?? 'Hoş Geldiniz , \n Sipariş vermeniz için ben size yardımcı olacağım.',
                {
                    reply_markup: {
                        // one_time_keyboard: true,
                        inline_keyboard:
                        inline_keyboard
                    }
                })
        }

    }

    private static async createNewUserIfUserDoesnitExist(ctx: BotContext) {
        const customerRepository = getCustomRepository(CustomerRepository);
        const customer = await customerRepository.getCustomerByTelegramId(ctx);
        if (!customer) {
            const newCustomer: Customer = { CustomerChannel:Channel.Telegram, FullName: ctx.from.first_name + ' '+ ctx.from.last_name,TelegramId: ctx.from.id, TelegramUserName: ctx.from.username };
            await customerRepository.save(newCustomer);
        }

    }

}