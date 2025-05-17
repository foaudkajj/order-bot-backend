import {Injectable} from '@nestjs/common';
import {BotContext} from '../interfaces/bot-context';
import {CallBackQueryResult} from '../models/enums';
import {OrdersInBasketCb} from './get-active-order-cb-handler';
import {BotCommands} from '../bot-commands';
import {OrderRepository} from 'src/db/repositories';

@Injectable()
export class ConfirmOrderHandler {
  constructor(
    private orderInBasket: OrdersInBasketCb,
    private orderRepository: OrderRepository,
  ) {}
  public async confirmOrder(ctx: BotContext) {
    const order = await this.orderRepository.getCurrentOrder(ctx, {
      orderItems: {product: true},
      customer: true,
    });

    const orderDetails = await this.orderInBasket.getOrdersDetails(ctx, [
      order,
    ]);

    const orders =
      orderDetails == null
        ? 'Sepetiniz boştur. Lütfen bir ürün seçiniz'
        : orderDetails;
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
