import { OrderStatus } from "src/DB/enums/OrderStatus";
import { getCustomRepository } from "typeorm";
import { UserRepository } from "../custom-repositories/UserRepository";
import { BotContext } from "../interfaces/BotContext";
import { CallBackQueryResult } from "../models/CallBackQueryResult";
import { OrdersInBasketCb } from "./get-orders-in-basket-CB-handler";

export abstract class StartOrderingCb {

  public static async StartOrdering(ctx: BotContext) {
    const userRepository = getCustomRepository(UserRepository);
    let user = await userRepository.getUser(ctx);
    user.SelectedProducts = null;
    await userRepository.update({ Id: user.Id }, user);
    let orderDetails = await OrdersInBasketCb.GetOrdersInBasketByStatus(ctx, OrderStatus.InBasket);
    await this.ShowProductCategories(ctx, orderDetails);


  }

  static async ShowProductCategories(ctx: BotContext, orderDetails: string) {
    try {
      const orders = orderDetails === null ? 'Lütfen bir ürün seçiniz' : orderDetails;
      await ctx.editMessageText(orders,
        {
          parse_mode: "HTML",
          reply_markup: {
            // one_time_keyboard: true,
            inline_keyboard:
              [
                [{ text: "🍖 Kebap 🍢", switch_inline_query_current_chat: 'Kebap' }],
                [{ text: "🥤 İçecek 🍸", switch_inline_query_current_chat: "\u0130\u00E7ecek" }],
                [{ text: "🍲 Çorba 🥣", switch_inline_query_current_chat: "\u00C7orba" }],
                [{ text: "🍬 Tatlı 🍬", switch_inline_query_current_chat: "Tatl\u0131" }],
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