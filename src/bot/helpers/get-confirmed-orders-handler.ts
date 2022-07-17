import {OrderStatus} from 'src/db/models';
import {BotContext} from '../interfaces/bot-context';
import {CallBackQueryResult} from '../models/enums';
import {OrdersInBasketCb} from './get-orders-in-basket-cb-handler';

export abstract class GetConfirmedOrderCb {
  public static async GetConfirmedOrders(ctx: BotContext) {
    const orderDetails = await OrdersInBasketCb.GetOrdersInBasketByStatus(
      ctx,
      OrderStatus.UserConfirmed,
    );
    if (orderDetails !== null) {
      const orders =
        orderDetails === null ? 'Lütfen bir ürün seçiniz' : orderDetails;
      await ctx.reply(
        '<b>Sipariş Özeti</b>:\n' + orders, // '📍 Adresiniz Alınmıştır.📍 \n\n' +
        {
          parse_mode: 'HTML',
          reply_markup: {
            one_time_keyboard: true,
            inline_keyboard: [
              // [{ text: "👌 Siparişimi Onayla 👌", callback_data: CallBackQueryResult.SendOrder }],
              // [{ text: "🗒 Siparişe Not Ekle 🗒", callback_data: CallBackQueryResult.AddNoteToOrder }],
              [
                {
                  text: '◀️ Ana Menüye Dön ◀️',
                  callback_data: CallBackQueryResult.MainMenu,
                },
              ],
            ],
          },
        },
      );
    }
  }
}
