import {Injectable} from '@nestjs/common';
import {InlineKeyboardButton} from 'telegraf/typings/core/types/typegram';
import {BotContext} from '../interfaces/bot-context';
import {CallBackQueryResult} from '../models/enums';
import {
  CategoryRepository,
  CustomerRepository,
  OrderRepository,
} from '../../db/repositories';
import {OrdersInBasketCb} from './get-active-order-cb-handler';
import {BotCommands} from '../bot-commands';

@Injectable()
export class StartOrderingCb {
  constructor(
    private ordersInBasket: OrdersInBasketCb,
    private categoryRepository: CategoryRepository,
    private customerRepository: CustomerRepository,
    private orderRepository: OrderRepository,
  ) {}
  public async startOrdering(ctx: BotContext) {
    const order = await this.orderRepository.getCurrentOrder(ctx, {
      orderItems: {product: true},
      customer: true,
    });

    const orderDetails = await this.ordersInBasket.getOrdersDetails(ctx, [
      order,
    ]);
    await this.showProductCategories(ctx, orderDetails);
  }

  async showProductCategories(ctx: BotContext, orderDetails: string) {
    const customer = await this.customerRepository.getCurrentCustomer(ctx);
    const categories = await this.categoryRepository.orm.find({
      where: {merchantId: customer.merchantId},
    });

    if (categories?.length > 0) {
      const orders =
        orderDetails == null ? 'Lütfen seçim yapınız:' : orderDetails;

      await ctx.editMessageText(orders, {
        parse_mode: 'HTML',
        reply_markup: {
          // one_time_keyboard: true,
          inline_keyboard: [
            ...categories.map(
              mp =>
                <InlineKeyboardButton[]>[
                  {
                    text: mp.name,
                    switch_inline_query_current_chat: mp.categoryKey,
                  },
                ],
            ),
            ...BotCommands.getCustom([{action: CallBackQueryResult.MainMenu}]),
          ],
        },
      });
    } else {
      await ctx.editMessageText('Satıcı hiç ürün yüklememiştir.');
    }
  }
}
