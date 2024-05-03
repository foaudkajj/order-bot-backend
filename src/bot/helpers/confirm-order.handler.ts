import {Injectable} from '@nestjs/common';
import {OrderStatus} from 'src/models';
import {BotContext} from '../interfaces/bot-context';
import {CallBackQueryResult} from '../models/enums';
import {OrdersInBasketCb} from './get-active-order-cb-handler';
import {BotCommands} from '../bot-commands';

@Injectable()
export class ConfirmOrderHandler {
  constructor(private orderInBasket: OrdersInBasketCb) {}
  public async confirmOrder(ctx: BotContext) {
    const orderDetails = await this.orderInBasket.getActiveOrderDetails(
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
            inline_keyboard: BotCommands.getCustom([
              {action: CallBackQueryResult.SendOrder},
              {action: CallBackQueryResult.AddNoteToOrder},
              {action: CallBackQueryResult.MainMenu},
            ]),
          },
        },
      );
    }
  }
}
