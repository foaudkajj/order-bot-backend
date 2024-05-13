import {Injectable} from '@nestjs/common';
import {OrderStatus} from 'src/models';
import {OrderRepository} from '../../db/repositories/order.repository';
import {BotContext} from '../interfaces/bot-context';

@Injectable()
export class OrdersInBasketCb {
  constructor(private orderRepository: OrderRepository) {}

  /**
   * Displays the details of the current order (with the details of the products).
   * @param ctx
   * @returns {string}
   */
  public async getActiveOrderDetails(
    ctx: BotContext,
    // eslint-disable-next-line unused-imports/no-unused-vars
    orderStatus: OrderStatus,
  ): Promise<string> {
    let isCbQuyer = false;
    if (ctx.updateType === 'callback_query') isCbQuyer = true;

    let orderDetailsMessage = '';

    const order = await this.orderRepository.getCurrentUserActiveOrder(ctx, {
      orderItems: {product: true},
      customer: true,
    });
    if (!order || order?.orderItems?.length === 0) {
      orderDetailsMessage = null; // 'Sepetinizde Ürün Yoktur.\n Lütfen ürün seçiniz.\n\n';

      if (isCbQuyer) {
        await ctx.answerCbQuery('Sepetiniz Boştur. Lütfen Ürün Seçiniz');
      }
    } else {
      orderDetailsMessage = 'Sepetinizdeki Ürünler:\n\n';
      order.orderItems.forEach((orderDetails, inx) => {
        if (inx != 0) {
          orderDetailsMessage = orderDetailsMessage.concat(`\n`);
        }
        orderDetailsMessage = orderDetailsMessage.concat(
          `Ürün İsmi : ${orderDetails.product.title}\n`,
          `Fiyat (adet): ${orderDetails.product.unitPrice} TL\n`,
          `Miktar : ${orderDetails.amount}\n`,
          `Toplam Fiyat : <u>${orderDetails.amount * orderDetails.product.unitPrice} TL</u> \n`,
        );
      });
      // `Açıklama : ${orderDetails.Order.Description ?? "Yok"}`
      orderDetailsMessage = orderDetailsMessage.concat(
        `\n\n Toplam: <b>${order.totalPrice} TL </b> \n\n`,
      );

      orderDetailsMessage = orderDetailsMessage.concat(
        `Adres : ${order.customer.address ?? ''}\n`,
        `Telefon : ${order.customer.phoneNumber ?? ''}\n`,
      );

      orderDetailsMessage =
        order.note !== null
          ? orderDetailsMessage.concat(`Not: ${order.note} \n`)
          : orderDetailsMessage;

      if (isCbQuyer) await ctx.answerCbQuery();
    }

    return orderDetailsMessage;
  }
}
