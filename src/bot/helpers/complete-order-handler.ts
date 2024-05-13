import {Injectable} from '@nestjs/common';
import {OrderRepository} from '../../db/repositories/order.repository';
import {BotContext} from '../interfaces/bot-context';
import {CallBackQueryResult} from '../models/enums';
import {BotCommands} from '../bot-commands';

@Injectable()
export class CompleteOrderHandler {
  constructor(private orderRepository: OrderRepository) {}

  async completeOrder(ctx: BotContext) {
    const ordersInBasket = await this.orderRepository.getCurrentUserActiveOrder(
      ctx,
      {
        customer: true,
      },
    );
    if (ordersInBasket) {
      const customer = ordersInBasket.customer;
      if (ctx.updateType === 'callback_query') await ctx.answerCbQuery();
      if (customer.address) {
        if (customer.location) {
          const location = JSON.parse(customer.location);
          await ctx.replyWithLocation(location.latitude, location.longitude);
        }

        await ctx.replyWithMarkdown(
          `<i>${customer.address}</i> \n \n` +
            '<b>Kayıtlı olan adres ve konumunuz mu kullanalım?</b> \n \n' +
            '<b>Note:</b> Açık adres ile konum uyuşmadığı takdirde, açık adres kullanılacaktır.',
          {
            parse_mode: 'HTML',
            reply_markup: {
              inline_keyboard: BotCommands.getCustom([
                {text: 'Evet', action: CallBackQueryResult.ConfirmOrder},
                {text: 'Hayır', action: CallBackQueryResult.EnterAddress},
              ]),
            },
          },
        );
      } else {
        await ctx.scene.enter(
          'address',
          // ctx.reply(
          //   'Lütfen Açık Adresinizi Giriniz. \n Tekrar Ana Menüye dönmek için bu komutu çalıştırınız /iptal',
          // ),
        );
      }
    } else {
      await ctx.answerCbQuery('Sepetiniz Boştur. Lütfen Ürün Seçiniz');
    }
  }
}
