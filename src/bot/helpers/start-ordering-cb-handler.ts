import {Injectable} from '@nestjs/common';
import {OrderStatus} from 'src/models/enums';
import {InlineKeyboardButton} from 'telegraf/typings/core/types/typegram';
import {BotContext} from '../interfaces/bot-context';
import {CallBackQueryResult} from '../models/enums';
import {CategoryRepository, CustomerRepository} from '../../db/repositories';
import {OrdersInBasketCb} from './get-active-order-cb-handler';
import {BotCommands} from '../bot-commands';

@Injectable()
export class StartOrderingCb {
  constructor(
    private ordersInBasket: OrdersInBasketCb,
    private categoryRepository: CategoryRepository,
    private customerRepository: CustomerRepository,
  ) {}
  public async StartOrdering(ctx: BotContext) {
    try {
      const orderDetails = await this.ordersInBasket.getActiveOrderDetails(
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
      const customer = await this.customerRepository.getCurrentCustomer(ctx);
      const categories = await this.categoryRepository.orm.find({
        where: {merchantId: customer.merchantId},
      });

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
              ...BotCommands.getCustom([
                {action: CallBackQueryResult.MainMenu},
              ]),
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
