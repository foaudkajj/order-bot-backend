import { OrderStatus } from "src/DB/enums/OrderStatus";
import { getCustomRepository, getRepository, Repository } from "typeorm";
import { OrderRepository } from "../custom-repositories/OrderRepository";
import { BotContext } from "../interfaces/BotContext";

export abstract class OrdersInBasketCb {

  public static async GetOrdersInBasketByStatus(ctx: BotContext, orderStatus: OrderStatus) {
    let isCbQuyer = false;
    if (ctx.updateType === 'callback_query')
      isCbQuyer = true;

    const orderRepository = getCustomRepository(OrderRepository);
    let orderDetailsMessage = '';
    try {
      const orderInBasket = await orderRepository.getOrdersInBasketByStatus(ctx, orderStatus, ['OrderDetails', 'OrderDetails.Product']);
      const ordersDetailsList = orderInBasket?.OrderDetails ?? [];
      if (ordersDetailsList.length == 0) {
        orderDetailsMessage = null;//'Sepetinizde Ürün Yoktur.\n Lütfen ürün seçiniz.\n\n';

        if (isCbQuyer)
          await ctx.answerCbQuery("Sepetiniz Boştur. Lütfen Ürün Seçiniz");
      } else {
        let TotalPrice = ordersDetailsList.map(order => order.Product.UnitPrice * (order.Amount > 0 ? order.Amount : 1)).reduce((previous, current) => previous + current);
        orderDetailsMessage = 'Sepetinizdeki Ürünler:\n\n';
        ordersDetailsList.forEach(orderDetails => {
          orderDetailsMessage = orderDetailsMessage.concat(`Ürün İsmi : ${orderDetails.Product.Title}\n`, `Fiyat: <u> ${orderDetails.Product.UnitPrice} TL</u>\n`, `Miktar : ${orderDetails.Amount}\n` + '\n');
        });
        // `Açıklama : ${orderDetails.Order.Description ?? "Yok"}`
        orderDetailsMessage = orderDetailsMessage.concat(`\n\n Toplam: <b>${TotalPrice} TL </b>`);
        orderDetailsMessage = orderInBasket.Description !== null ? orderDetailsMessage.concat(`\n\n Not: ${orderInBasket.Description}`) : orderDetailsMessage;

        if (isCbQuyer)
          await ctx.answerCbQuery();
      }

    } catch (error) {
      //Loglama
      console.log(error);
      await ctx.answerCbQuery("Bir hata oluştu. Lütfen tekrar deneyiniz.")
    }


    return orderDetailsMessage;
  }
}