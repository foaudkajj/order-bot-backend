import { OrderStatus } from "src/DB/enums/OrderStatus";
import { Category } from "src/DB/models/Category";
import { InlineKeyboardButton } from "telegraf/typings/telegram-types";
import { getCustomRepository, getRepository, Repository } from "typeorm";
import { CustomerRepository } from "../custom-repositories/CustomerRepository";
import { BotContext } from "../interfaces/BotContext";
import { CallBackQueryResult } from "../models/CallBackQueryResult";
import { OrdersInBasketCb } from "./get-orders-in-basket-CB-handler";

export abstract class StartOrderingCb {
  public static async StartOrdering(ctx: BotContext) {
    const userRepository = getCustomRepository(CustomerRepository);
    let user = await userRepository.getUser(ctx);
    user.SelectedProducts = null;
    await userRepository.update({ TelegramId: user.TelegramId }, user);
    let orderDetails = await OrdersInBasketCb.GetOrdersInBasketByStatus(ctx, OrderStatus.InBasket);
    await this.ShowProductCategories(ctx, orderDetails);


  }

  static async ShowProductCategories(ctx: BotContext, orderDetails: string) {
    try {
      const orders = orderDetails === null ? 'Lütfen bir ürün seçiniz' : orderDetails;
      var categories: Category[] = await getRepository(Category)
        .find();
      await ctx.editMessageText(orders,
        {
          parse_mode: "HTML",
          reply_markup: {
            // one_time_keyboard: true,
            inline_keyboard:
              [...categories.map(mp => <InlineKeyboardButton[]>
                (
                  [{ text: mp.Name, switch_inline_query_current_chat: mp.CategoryKey }]
                )
              ),
              [{ text: "◀️ Ana Menüye Dön ◀️", callback_data: CallBackQueryResult.MainMenu }]
              ]
          }
        });
    } catch (error) {
      //Loglama
      console.log(error);
    }

  }
}