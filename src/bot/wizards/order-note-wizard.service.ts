import {Injectable} from '@nestjs/common';
import {OrderStatus} from 'src/models';
import {Scenes} from 'telegraf';
import {OrderRepository, CustomerRepository} from '../../db/repositories';
import {ConfirmOrderHandler} from '../helpers/confirm-order.handler';
import {BotContext} from '../interfaces/bot-context';

@Injectable()
export class AddnoteToOrderWizardService {
  constructor(
    private orderRepository: OrderRepository,
    private customerRepository: CustomerRepository,
    private confirmOrderHandler: ConfirmOrderHandler,
  ) {}

  initilizeAddnoteToOrderWizard() {
    const AddnoteToOrderWizard = new Scenes.WizardScene(
      'AddNoteToOrder',
      async (ctx: BotContext) => {
        if (ctx.updateType === 'callback_query') ctx.answerCbQuery();

        if (ctx.message && 'text' in ctx.message) {
          const [customer, _] = await Promise.all([
            this.customerRepository.getCurrentCustomer(ctx),
            ctx.reply('Kaydedilmiştir...'),
          ]);

          await this.orderRepository.orm.update(
            {customerId: customer.id, orderStatus: OrderStatus.New},
            {note: ctx.message.text},
          );
          await this.confirmOrderHandler.confirmOrder(ctx);
          await ctx.scene.leave();
        } else {
          await ctx.reply(
            'Lütfen Eklemek İstediğiniz notu giriniz.... \n Tekrar Ana Menüyedönmek için iptale /iptal tıklayınız',
          );
        }
      },
    );
    return AddnoteToOrderWizard;
  }
}
