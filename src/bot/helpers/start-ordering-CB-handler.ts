import {OrderStatus} from 'src/DB/enums/OrderStatus';
import {Category} from 'src/DB/models/Category';
import {InlineKeyboardButton} from 'telegraf/typings/telegram-types';
import {getCustomRepository, getRepository, Repository} from 'typeorm';
import {CustomerRepository} from '../custom-repositories/CustomerRepository';
import {BotContext} from '../interfaces/BotContext';
import {CallBackQueryResult} from '../models/CallBackQueryResult';
import {OrdersInBasketCb} from './get-orders-in-basket-CB-handler';

export abstract class StartOrderingCb {
  public static async StartOrdering(ctx: BotContext) {
    try {
      // const customerRepository = getCustomRepository(CustomerRepository);
      // let cutsomer = await customerRepository.getCustomer(ctx);
      // user.SelectedProducts = null;
      // await customerRepository.update({ TelegramId: cutsomer.TelegramId }, cutsomer);
      let orderDetails = await OrdersInBasketCb.GetOrdersInBasketByStatus(
        ctx,
        OrderStatus.New,
      );
      await this.ShowProductCategories(ctx, orderDetails);
    } catch (e) {
      console.log(e);
    }
  }

  static async ShowProductCategories(ctx: BotContext, orderDetails: string) {
    try {
      const orders =
        orderDetails === null ? 'Lütfen bir ürün seçiniz' : orderDetails;
      var categories: Category[] = await getRepository(Category).find();
      await ctx.editMessageText(orders, {
        parse_mode: 'HTML',
        reply_markup: {
          // one_time_keyboard: true,
          inline_keyboard: [
            ...categories.map(
              mp =>
                <InlineKeyboardButton[]>[
                  {
                    text: mp.Name,
                    switch_inline_query_current_chat: mp.CategoryKey,
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
      //Loglama
      console.log(error);
    }
  }
}
