import {Injectable} from '@nestjs/common';
import {Scenes} from 'telegraf';
import {CustomerRepository} from '../../db/repositories';
import {CompleteOrderHandler} from '../helpers/complete-order-handler';
import {BotContext} from '../interfaces/bot-context';

@Injectable()
export class PhoneNumberWizardService {
  constructor(
    private customerRepository: CustomerRepository,
    private completeOrderHandler: CompleteOrderHandler,
  ) {}

  initilizePhoneNumberWizard() {
    const phoneNumber = new Scenes.WizardScene(
      'phone-number',
      async (ctx: BotContext) => {
        if (ctx.updateType === 'callback_query') ctx.answerCbQuery();

        if (ctx?.message && 'contact' in ctx?.message) {
          const customer =
            await this.customerRepository.getCurrentCustomer(ctx);
          const phoneNumberComplete =
            ctx.message.contact.phone_number.startsWith('+');
          const phoneNumber = ctx.message.contact.phone_number;
          customer.phoneNumber = phoneNumberComplete
            ? phoneNumber
            : `+${phoneNumber}`;
          await this.customerRepository.orm.update({id: customer.id}, customer);
          // ctx.scene.session.address = ctx.message.contact.phone_number;
          await ctx.scene.leave();
          await this.completeOrderHandler.completeOrder(ctx);
        } else {
          await ctx.reply(
            'Lütfen telefon numarınızı gönderiniz.\n Tekrar Ana Menüye dönmek için iptale /iptal tıklayınız',
            {
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
            },
          );
        }
      },
    );
    return phoneNumber;
  }
}
