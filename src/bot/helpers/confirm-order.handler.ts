import {OrderStatus} from 'src/DB/models';
import {BotContext} from '../interfaces/BotContext';
import {CallBackQueryResult} from '../models/CallBackQueryResult';
import {OrdersInBasketCb} from './get-orders-in-basket-CB-handler';

export abstract class ConfirmOrderHandler {
  public static async ConfirmOrder(ctx: BotContext) {
    const orderDetails = await OrdersInBasketCb.GetOrdersInBasketByStatus(
      ctx,
      OrderStatus.New,
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
              [
                {
                  text: '👌 Siparişimi Onayla 👌',
                  callback_data: CallBackQueryResult.SendOrder,
                },
              ],
              [
                {
                  text: '🗒 Siparişe Not Ekle 🗒',
                  callback_data: CallBackQueryResult.AddNoteToOrder,
                },
              ],
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
