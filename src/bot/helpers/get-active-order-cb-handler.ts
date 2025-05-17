import {Injectable} from '@nestjs/common';
import {Order, orderStatusTranslations} from 'src/models';
import {BotContext} from '../interfaces/bot-context';

@Injectable()
export class OrdersInBasketCb {
  constructor() {}

  /**
   * Displays the details of the current order (with the details of the products).
   * @param ctx
   * @returns {string}
   */
  public async getOrdersDetails(
    ctx: BotContext,
    orders: Order[],
  ): Promise<string> {
    let orderDetailsMessage = '';

    if (!orders.length || orders?.every(o => !o?.orderItems?.length)) {
      return null;
    }

    for (const order of orders) {
      if (!order?.orderItems?.length) {
        continue;
      }

      order?.orderItems.forEach((orderDetails, inx) => {
        if (inx != 0) {
          orderDetailsMessage = orderDetailsMessage.concat(`\n`);
        }
        orderDetailsMessage = orderDetailsMessage.concat(
          `Ürün İsmi : ${orderDetails.product.title}\n`,
          `Fiyat (adet): ${orderDetails.product.unitPrice} TL\n`,
          `Miktar : ${orderDetails.amount}\n`,
        );
      });

      orderDetailsMessage = orderDetailsMessage.concat(`\n`);

      orderDetailsMessage = orderDetailsMessage.concat(
        `Adres : ${order.customer.address ?? ''}\n`,
        `Telefon : ${order.customer.phoneNumber ?? ''}\n`,
        `Sipariş Durumu: ${orderStatusTranslations(order.orderStatus, 'tr')} \n`,
        `Sipariş No: ${order.orderNo} \n`,
        `Sipariş Tarihi: ${order.createDate.toLocaleDateString('tr-TR', {dateStyle: 'medium'})}\n`,
        order.note !== null ? `Not: ${order.note} \n` : '',
      );

      orderDetailsMessage = orderDetailsMessage.concat(
        `\n <b>Toplam: ${order.totalPrice} TL</b> \n`,
      );

      orderDetailsMessage = orderDetailsMessage.concat(
        `---------------------------------------------------------------- \n`,
      );
    }

    return orderDetailsMessage;
  }
}
