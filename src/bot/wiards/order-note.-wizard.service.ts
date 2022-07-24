import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Customer, OrderStatus} from 'src/db/models';
import {Order} from 'src/db/models/order';
import {Scenes} from 'telegraf';
import {Repository} from 'typeorm';
import {OrderRepository} from '../custom-repositories';
import {CustomerRepository} from '../custom-repositories/customer-repository';
import {ConfirmOrderHandler} from '../helpers/confirm-order.handler';
import {BotContext} from '../interfaces/bot-context';

@Injectable()
export class AddnoteToOrderWizardService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: OrderRepository,
    @InjectRepository(Customer)
    private customerRepository: CustomerRepository,
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
          await this.orderRepository.update(
            {customerId: customer.id, orderStatus: OrderStatus.New},
            {note: ctx.message.text},
          );
          await ConfirmOrderHandler.ConfirmOrder(ctx);
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
