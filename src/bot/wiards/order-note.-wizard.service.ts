import {Injectable} from '@nestjs/common';
import {OrderStatus} from 'src/db/models';
import {Scenes} from 'telegraf';
import {OrderRepository, CustomerRepository} from '../repositories';
import {ConfirmOrderHandler} from '../helpers/confirm-order.handler';
import {BotContext} from '../interfaces/bot-context';

@Injectable()
export class AddnoteToOrderWizardService {
  constructor(
    private orderRepository: OrderRepository,
    private customerRepository: CustomerRepository,
    private confirmOrderHandler: ConfirmOrderHandler,
  ) {}

  InitilizeAddnoteToOrderWizard() {
    const AddnoteToOrderWizard = new Scenes.WizardScene(
      'AddNoteToOrder',
      async (ctx: BotContext) => {
        if (ctx.updateType === 'callback_query') ctx.answerCbQuery();

        if (ctx.message && 'text' in ctx.message) {
          await ctx.reply('Kaydedilmiştir...');
          // const userInfo = ctx.from.is_bot ? ctx.callbackQuery.from : ctx.from;
          const customer =
            await this.customerRepository.getCustomerByTelegramId(ctx);
          await this.orderRepository.orm.update(
            {customerId: customer.id, orderStatus: OrderStatus.New},
            {note: ctx.message.text},
          );
          await this.confirmOrderHandler.ConfirmOrder(ctx);
          await ctx.scene.leave();
        } else {
          await ctx.reply(
            'Lütfen Eklemek İstediğiniz notu giriniz.... \n Tekrar Ana Menüye dönmek için bu komutu çalıştırınız /iptal',
          );
        }
      },
    );
    return AddnoteToOrderWizard;
  }
}
