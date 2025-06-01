import {Injectable} from '@nestjs/common';
import {BotCommands} from '../bot-commands';
import {CallBackQueryResult} from '../models/enums';
import {Customer} from 'src/models';
import {BotContext} from '../interfaces';
import {CustomerRepository} from 'src/db/repositories';

@Injectable()
export class AddressHandler {
  constructor(private customerRepository: CustomerRepository) {}

  async startAddressSteps(
    ctx: BotContext,
    customer: Customer,
    confirmCurrentAddressQueryResult: CallBackQueryResult,
  ): Promise<BotContext> {
    if (customer?.address) {
      await this.showCurrentAddressIfExists(ctx, customer);

      await ctx.replyWithMarkdownV2(
        `<i>${customer.address}</i> \n \n` +
          '<b>Kayıtlı olan adres ve konumunuzu mu kullanalım?</b> \n \n',
        {
          parse_mode: 'HTML',
          reply_markup: {
            inline_keyboard: BotCommands.getCustom([
              {text: 'Evet', action: confirmCurrentAddressQueryResult},
              {text: 'Hayır', action: CallBackQueryResult.StartAdderssWizard},
            ]),
          },
        },
      );
    } else {
      await this.enterAddress(ctx);
    }

    return ctx;
  }

  async showCurrentAddressIfExists(ctx: BotContext, customer: Customer) {
    if (customer?.location) {
      const location = JSON.parse(customer.location);
      await ctx.replyWithLocation(location.latitude, location.longitude);
    }
  }

  async saveAddressToDB(ctx: BotContext) {
    const customer = await this.customerRepository.getCurrentCustomer(ctx);
    if (customer) {
      customer.address = ctx.scene.session?.address;
      if (ctx.scene.session.isLocation) {
        customer.location = JSON.stringify({
          latitude: ctx.scene.session.latitude,
          longitude: ctx.scene.session.longitude,
        });
      }
      await this.customerRepository.orm.save(customer);
    }
  }

  async enterAddress(ctx: BotContext) {
    await ctx.scene.enter('address');
  }
}
