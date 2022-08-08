import {Injectable} from '@nestjs/common';
import {OrderStatus} from 'src/db/models/enums';
import {InlineKeyboardButton} from 'telegraf/typings/core/types/typegram';
import {BotContext} from '../interfaces/bot-context';
import {CallBackQueryResult} from '../models/enums';
import {CategoryRepository} from '../../db/repositories';
import {OrdersInBasketCb} from './get-orders-in-basket-cb-handler';

@Injectable()
export class StartOrderingCb {
  constructor(
    private ordersInBasket: OrdersInBasketCb,
    private categoryRepository: CategoryRepository,
  ) {}
  public async StartOrdering(ctx: BotContext) {
    try {
      const orderDetails = await this.ordersInBasket.GetOrdersInBasketByStatus(
        ctx,
        OrderStatus.New,
      );
      await this.showProductCategories(ctx, orderDetails);
    } catch (e) {
      console.log(e);
    }
  }

  async showProductCategories(ctx: BotContext, orderDetails: string) {
    try {
      const categories = await this.categoryRepository.orm.find();
      if (categories?.length > 0) {
        const orders =
          orderDetails === null ? 'Lütfen seçim yapınız:' : orderDetails;

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
              [
                {
                  text: '◀️ Ana Menüye Dön ◀️',
                  callback_data: CallBackQueryResult.MainMenu,
                },
              ],
            ],
          },
        });
      } else {
        await ctx.editMessageText('Satıcı hiç ürün yüklememiştir.');
      }
    } catch (error) {
      // Loglama
      console.log(error);
    }
  }
}
