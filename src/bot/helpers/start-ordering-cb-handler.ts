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
      // const customerRepository = getCustomRepository(CustomerRepository);
      // let cutsomer = await customerRepository.getCustomer(ctx);
      // user.SelectedProducts = null;
      // await customerRepository.update({ TelegramId: cutsomer.TelegramId }, cutsomer);
      const orderDetails = await this.ordersInBasket.GetOrdersInBasketByStatus(
        ctx,
        OrderStatus.New,
      );
      await this.ShowProductCategories(ctx, orderDetails);
    } catch (e) {
      console.log(e);
    }
  }

  async ShowProductCategories(ctx: BotContext, orderDetails: string) {
    try {
      const orders =
        orderDetails === null ? 'Lütfen bir ürün seçiniz' : orderDetails;

      const categories = await this.categoryRepository.orm.find();
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
    } catch (error) {
      // Loglama
      console.log(error);
    }
  }
}
