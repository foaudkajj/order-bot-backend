import {Injectable} from '@nestjs/common';
import {BotContext} from '../interfaces/bot-context';
import {CallBackQueryResult} from '../models/enums';
import {OrdersInBasketCb} from './get-active-order-cb-handler';
import {BotCommands} from '../bot-commands';
import {OrderRepository} from 'src/db/repositories';

@Injectable()
export class GetConfirmedOrderCb {
  constructor(
    private orderInBasket: OrdersInBasketCb,
    private orderRepository: OrderRepository,
  ) {}

  /**
   * Returns the user confirmed order. User confirmed means that the user has finished the selection of the products and confirmed the order.
   * @param ctx
   */
  public async getActiveOrders(ctx: BotContext) {
    const orders = await this.orderRepository.getActiveOrders(ctx, {
      orderItems: {product: true},
      customer: true,
    });

    if (!orders.length || orders.every(o => !o?.orderItems?.length)) {
      await ctx.answerCbQuery('Akfit siparişiniz bulunmamaktadır.');
    } else {
      const orderDetails = await this.orderInBasket.getOrdersDetails(
        ctx,
        orders,
      );

      await ctx.answerCbQuery();

      if (orderDetails !== null) {
        await ctx.reply('<b>Sipariş Özeti</b>:\n' + orderDetails, {
          parse_mode: 'HTML',
          reply_markup: {
            one_time_keyboard: true,
            inline_keyboard: BotCommands.getCustom([
              {action: CallBackQueryResult.MainMenu},
            ]),
          },
        });
      }
    }
  }
}
