import {OrderStatus} from 'src/db/models';
import {getCustomRepository} from 'typeorm';
import {OrderRepository} from '../custom-repositories/order-repository';
import {BotContext} from '../interfaces/bot-context';

export abstract class OrdersInBasketCb {
  public static async GetOrdersInBasketByStatus(
    ctx: BotContext,
    // eslint-disable-next-line unused-imports/no-unused-vars
    orderStatus: OrderStatus,
  ) {
    try {
      let isCbQuyer = false;
      if (ctx.updateType === 'callback_query') isCbQuyer = true;

      const orderRepository = getCustomRepository(OrderRepository);
      let orderDetailsMessage = '';

      const order = await orderRepository.getOrderInBasketByTelegramId(ctx, [
        'orderItems',
        'orderItems.Product',
      ]);
      if (!order || order?.orderItems?.length === 0) {
        orderDetailsMessage = null; // 'Sepetinizde Ürün Yoktur.\n Lütfen ürün seçiniz.\n\n';

        if (isCbQuyer) {
          await ctx.answerCbQuery('Sepetiniz Boştur. Lütfen Ürün Seçiniz');
        }
      } else {
        const TotalPrice = order.orderItems
          .map(
            order =>
              order.Product.UnitPrice * (order.Amount > 0 ? order.Amount : 1),
          )
          .reduce((previous, current) => previous + current);
        orderDetailsMessage = 'Sepetinizdeki Ürünler:\n\n';
        order.orderItems.forEach(orderDetails => {
          orderDetailsMessage = orderDetailsMessage.concat(
            `Ürün İsmi : ${orderDetails.Product.Title}\n`,
            `Fiyat: <u> ${orderDetails.Product.UnitPrice} TL</u>\n`,
            `Miktar : ${orderDetails.Amount}\n` + '\n',
          );
        });
        // `Açıklama : ${orderDetails.Order.Description ?? "Yok"}`
        orderDetailsMessage = orderDetailsMessage.concat(
          `\n\n Toplam: <b>${TotalPrice} TL </b>`,
        );
        orderDetailsMessage =
          order.Note !== null
            ? orderDetailsMessage.concat(`\n\n Not: ${order.Note}`)
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
