import {Injectable} from '@nestjs/common';
import {OrderStatus} from 'src/models';
import {OrderRepository} from '../../db/repositories/order.repository';
import {BotContext} from '../interfaces/bot-context';

@Injectable()
export class OrdersInBasketCb {
  constructor(private orderRepository: OrderRepository) {}
  public async GetOrdersInBasketByStatus(
    ctx: BotContext,
    // eslint-disable-next-line unused-imports/no-unused-vars
    orderStatus: OrderStatus,
  ) {
    try {
      let isCbQuyer = false;
      if (ctx.updateType === 'callback_query') isCbQuyer = true;

      let orderDetailsMessage = '';

      const order = await this.orderRepository.getOrderInBasketByTelegramId(
        ctx,
        {orderItems: {product: true}},
      );
      if (!order || order?.orderItems?.length === 0) {
        orderDetailsMessage = null; // 'Sepetinizde Ürün Yoktur.\n Lütfen ürün seçiniz.\n\n';

        if (isCbQuyer) {
          await ctx.answerCbQuery('Sepetiniz Boştur. Lütfen Ürün Seçiniz');
        }
      } else {
        const TotalPrice = order.orderItems
          .map(
            order =>
              order.product.unitPrice * (order.amount > 0 ? order.amount : 1),
          )
          .reduce((previous, current) => previous + current);
        orderDetailsMessage = 'Sepetinizdeki Ürünler:\n\n';
        order.orderItems.forEach(orderDetails => {
          orderDetailsMessage = orderDetailsMessage.concat(
            `Ürün İsmi : ${orderDetails.product.title}\n`,
            `Fiyat: <u> ${orderDetails.product.unitPrice} TL</u>\n`,
            `Miktar : ${orderDetails.amount}\n` + '\n',
          );
        });
        // `Açıklama : ${orderDetails.Order.Description ?? "Yok"}`
        orderDetailsMessage = orderDetailsMessage.concat(
          `\n\n Toplam: <b>${TotalPrice} TL </b>`,
        );
        orderDetailsMessage =
          order.note !== null
            ? orderDetailsMessage.concat(`\n\n Not: ${order.note}`)
            : orderDetailsMessage;

        if (isCbQuyer) await ctx.answerCbQuery();
      }

      return orderDetailsMessage;
    } catch (error) {
      // Loglama
      console.log(error);
      await ctx.answerCbQuery('Bir hata oluştu. Lütfen tekrar deneyiniz.');
    }
  }
}
