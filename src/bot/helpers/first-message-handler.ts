import {Injectable} from '@nestjs/common';
import {OrderChannel} from 'src/models';
import {Customer} from 'src/models/customer';

import {MerchantRepository, CustomerRepository} from '../../db/repositories';
import {BotContext} from '../interfaces/bot-context';
import {BotCommands} from '../bot-commands';

@Injectable()
export class FirstMessageHandler {
  constructor(
    private customerRepository: CustomerRepository,
    private merchantRepository: MerchantRepository,
  ) {}

  async startOptions(ctx: BotContext, messageToShow: null | string = null) {
    await this.createNewUserIfUserDoesnitExist(ctx);
    if (ctx.updateType === 'message') {
      return await ctx.reply(
        messageToShow ??
          'Hoş Geldiniz , \n Sipariş vermeniz için ben size yardımcı olacağım.',
        {
          reply_markup: {
            one_time_keyboard: true,
            inline_keyboard: BotCommands.getMainMenu(),
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
            inline_keyboard: BotCommands.getMainMenu(),
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
