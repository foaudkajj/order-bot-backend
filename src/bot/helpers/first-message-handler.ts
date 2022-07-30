import {Injectable} from '@nestjs/common';
import {OrderChannel} from 'src/db/models';
import {Customer} from 'src/db/models/customer';
import {InlineKeyboardButton} from 'telegraf/typings/core/types/typegram';
import {MerchantRepository, CustomerRepository} from '../custom-repositories';
import {BotContext} from '../interfaces/bot-context';
import {CallBackQueryResult} from '../models/enums';

@Injectable()
export class FirstMessageHandler {
  constructor(
    private customerRepository: CustomerRepository,
    private merchantRepository: MerchantRepository,
  ) {}

  async startOptions(ctx: BotContext, messageToShow: null | string = null) {
    const inlineKeyboard: InlineKeyboardButton[][] = [
      [
        {
          text: '🥘 Sipariş Ver 🥘',
          callback_data: CallBackQueryResult.StartOrdering,
        },
      ],
      [
        {
          text: '🚚 Siparişini Takip Et 🚚',
          callback_data: CallBackQueryResult.GetConfirmedOrders,
        },
      ],
      [{text: '🗑 Sepetem 🗑', callback_data: CallBackQueryResult.MyBasket}],
      [
        {
          text: '🗑 Sepetemi Boşalt 🗑',
          callback_data: CallBackQueryResult.EmptyBakset,
        },
      ],
      [
        {
          text: '✔️ Siparişimi Tamamla ✔️',
          callback_data: CallBackQueryResult.CompleteOrder,
        },
      ],
    ];
    await this.createNewUserIfUserDoesnitExist(ctx);
    if (ctx.updateType === 'message') {
      return await ctx.reply(
        messageToShow ??
          'Hoş Geldiniz , \n Sipariş vermeniz için ben size yardımcı olacağım.',
        {
          reply_markup: {
            one_time_keyboard: true,
            inline_keyboard: inlineKeyboard,
          },
        },
      );
    } else {
      return await ctx.editMessageText(
        messageToShow ??
          'Hoş Geldiniz , \n Sipariş vermeniz için ben size yardımcı olacağım.',
        {
          reply_markup: {
            // one_time_keyboard: true,
            inline_keyboard: inlineKeyboard,
          },
        },
      );
    }
  }

  private async createNewUserIfUserDoesnitExist(ctx: BotContext) {
    const customer = await this.customerRepository.getCustomerByTelegramId(ctx);
    if (!customer) {
      const merchant = await this.merchantRepository.getMerchantIdByBotUserName(
        ctx.botInfo.username,
      );

      const newCustomer: Customer = {
        merchantId: merchant.id,
        customerChannel: OrderChannel.Telegram,
        fullName: ctx.from.first_name + ' ' + ctx.from.last_name,
        telegramId: ctx.from.id,
        telegramUserName: ctx.from.username,
      };
      await this.customerRepository.orm.save(newCustomer);
    }
  }
}
