import {Injectable} from '@nestjs/common';
import {Scenes} from 'telegraf';
import {CustomerRepository} from '../custom-repositories';
import {CompleteOrderHandler} from '../helpers/complete-order-handler';
import {BotContext} from '../interfaces/bot-context';

@Injectable()
export class PhoneNumberService {
  constructor(
    private customerRepository: CustomerRepository,
    private completeOrderHandler: CompleteOrderHandler,
  ) {}

  InitilizePhoneNumberWizard() {
    const phoneNumber = new Scenes.WizardScene(
      'phone-number',
      async (ctx: BotContext) => {
        if (ctx.updateType === 'callback_query') ctx.answerCbQuery();

        if (ctx?.message && 'contact' in ctx?.message) {
          const customer =
            await this.customerRepository.getCustomerByTelegramId(ctx);
          customer.phoneNumber = ctx.message.contact.phone_number;
          await this.customerRepository.orm.update({id: customer.id}, customer);
          // ctx.scene.session.address = ctx.message.contact.phone_number;
          await ctx.scene.leave();
          await this.completeOrderHandler.CompleteOrder(ctx);
        } else {
          await ctx.reply('Lütfen telefon numarınızı gönderiniz. /iptal', {
            reply_markup: {
              keyboard: [
                [
                  {
                    request_contact: true,
                    text: 'Bu butona tıklayarak telefon numaranızı gönderebilirsiniz.',
                  },
                ],
              ],
              one_time_keyboard: true,
            },
          });
        }
      },
    );
    return phoneNumber;
  }
}
