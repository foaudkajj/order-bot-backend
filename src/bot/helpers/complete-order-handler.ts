import {Injectable} from '@nestjs/common';
import {OrderRepository} from '../../db/repositories/order.repository';
import {BotContext} from '../interfaces/bot-context';
import {AddressHandler} from './address.handler';
import {CallBackQueryResult} from '../models/enums';

@Injectable()
export class CompleteOrderHandler {
  constructor(
    private orderRepository: OrderRepository,
    private addressHandler: AddressHandler,
  ) {}

  async completeOrder(ctx: BotContext) {
    const order = await this.orderRepository.getCurrentOrder(ctx, {
      customer: true,
    });
    if (order) {
      const customer = order.customer;
      if (ctx.updateType === 'callback_query') await ctx.answerCbQuery();
      await this.addressHandler.startAddressSteps(
        ctx,
        customer,
        CallBackQueryResult.ConfirmOrder,
      );
    } else {
      await ctx.answerCbQuery('Sepetiniz Boştur. Lütfen Ürün Seçiniz');
    }
  }
}
