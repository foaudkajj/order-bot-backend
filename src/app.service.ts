import { Injectable, OnModuleInit } from '@nestjs/common';
import { Context, Scenes, session, Telegraf } from 'telegraf';
// import { TelegrafContext } from 'telegraf/typings/context';
import { InlineQueryResult, InlineQueryResultArticle, User } from 'telegraf/typings/telegram-types';
import { getCustomRepository, getRepository, Repository } from 'typeorm';
import { BotContext } from './bot/interfaces/BotContext';
import { CallBackQueryResult } from './bot/models/CallBackQueryResult';
import { AddressWizardService } from './bot/wiards/address-wizard.service';
import { OrderStatus } from './DB/enums/OrderStatus';
import { Order } from './DB/models/Order';
import { Product } from './DB/models/Product';
import { TelegramUser } from './DB/models/TelegramUser';
import { Guid } from "guid-typescript";
import { AddnoteToOrderWizardService } from './bot/wiards/order-note.-wizard.service';
import { UserRepository } from './bot/custom-repositories/UserRepository';
import { StartOrderingCb } from './bot/helpers/start-ordering-CB-handler';
import { OrdersInBasketCb } from './bot/helpers/get-orders-in-basket-CB-handler';
import { FirstMessageHandler } from './bot/helpers/first-message-handler';
import { CompleteOrderHandler } from './bot/helpers/complete-order-handler';
import { OrderRepository } from './bot/custom-repositories/OrderRepository';
import { ConfirmOrderHandler } from './bot/helpers/confirm-order.handler';
import { OrderDetails } from './DB/models/OrderDetails';
import { GetConfirmedOrderCb } from './bot/helpers/get-confirmed-orders-handler';

@Injectable()
export class AppService implements OnModuleInit {
  userRepository = getCustomRepository(UserRepository);
  orderRepository = getCustomRepository(OrderRepository);
  orderDetailsRepository: Repository<OrderDetails> = getRepository(OrderDetails);
  productRepository: Repository<Product> = getRepository(Product);
  constructor(private addressWizard: AddressWizardService, private addNoteToOrderWizard: AddnoteToOrderWizardService) {

  }
  onModuleInit() {
    this.InitlizeAndLunchBot();
  }
  getHello(): string {
    return 'Hello Fuat!';
  }

  InitlizeAndLunchBot() {
    const bot = new Telegraf<BotContext>("1485687554:AAFbN5pD2h5hzi9o9eydQjh6l4RcVYTtp5c"); //, { handlerTimeout: 1000 }

    this.InitlizeWizards(bot);
    this.InilizeBotEventsHandlers(bot);


    bot.launch();
  }
  InilizeBotEventsHandlers(bot: Telegraf<BotContext>) {
    bot.command("start",
      async ctx => await FirstMessageHandler.startOptions(ctx)
    );


    bot.on("callback_query", async (ctx) => {
      // if ("data" in ctx.callbackQuery && ctx.callbackQuery.data) {
      //   console.log(ctx.callbackQuery.from.id)
      // }
      if ("data" in ctx.callbackQuery && ctx.callbackQuery.data) {
        // console.log(ctx.callbackQuery.data)
        switch (ctx.callbackQuery.data) {

          case CallBackQueryResult.StartOrdering:
            await ctx.answerCbQuery();
            await StartOrderingCb.StartOrdering(ctx);
            break;

          case CallBackQueryResult.AddProductAndCompleteOrder:
            await ctx.answerCbQuery();
            await this.AddProductAndCompleteOrder(ctx);
            break;

          case CallBackQueryResult.CompleteOrder:
            await CompleteOrderHandler.CompleteOrder(ctx);
            break;


          case CallBackQueryResult.AddToBasket:
            await ctx.answerCbQuery();
            await this.AddToBasket(ctx);
            break;

          case CallBackQueryResult.EnterAddress:
            await ctx.answerCbQuery();
            await this.EnterAddress(ctx);
            break;

          case CallBackQueryResult.SendOrder:
            await this.SendOrder(ctx);
            break;

          case CallBackQueryResult.MyBasket:
            const orderDetails = await OrdersInBasketCb.GetOrdersInBasketByStatus(ctx, OrderStatus.InBasket);
            if (orderDetails != null)
              await ctx.editMessageText(orderDetails,
                {
                  parse_mode: 'HTML',
                  reply_markup: {
                    // one_time_keyboard: true,
                    inline_keyboard:
                      [
                        [{ text: "🥘 Sipariş Ver 🥘", callback_data: CallBackQueryResult.StartOrdering }],
                        [{ text: "🚚 Siparişini Takip Et 🚚", callback_data: CallBackQueryResult.GetConfirmedOrders }],
                        // [{ text: "🗑 Sepetem 🗑", callback_data: CallBackQueryResult.MyBasket }],
                        [{ text: "🗑 Sepetemi Boşalt 🗑", callback_data: CallBackQueryResult.EmptyBakset }],
                        [{ text: "✔️ Siparişimi Tamamla ✔️", callback_data: CallBackQueryResult.CompleteOrder }],
                        [{ text: "◀️ Ana Menüye Dön ◀️", callback_data: CallBackQueryResult.MainMenu }]
                      ]
                  }
                });
            break;

          case CallBackQueryResult.ConfirmOrder:
            await ConfirmOrderHandler.ConfirmOrder(ctx);
            // await FirstMessageHandler.startOptions(ctx);
            break;


          case CallBackQueryResult.EmptyBakset:
            await this.EmptyBasket(ctx);
            break;

          case CallBackQueryResult.MainMenu:
            await ctx.answerCbQuery();
            await FirstMessageHandler.startOptions(ctx);
            break;

          case CallBackQueryResult.TrackOrder:
            await ctx.answerCbQuery("Bu Özellik Yapım Aşamasındadır");
            break;

          case CallBackQueryResult.AddNoteToOrder:
            await this.addNoteToOrder(ctx)
            break;

          case CallBackQueryResult.GetConfirmedOrders:
            await GetConfirmedOrderCb.GetConfirmedOrders(ctx);
            // await FirstMessageHandler.startOptions(ctx);
            break;

          default:
            await ctx.answerCbQuery();
            break;
        }
      }

    });

    bot.on("inline_query", async (ctx) => {
      try {
        const user = await this.userRepository.findOne({ where: { Id: ctx.from.id } });
        if (user) {
          const products = await this.productRepository.find();
          // let products = await user.Products;
          await ctx.answerInlineQuery(
            products.map(product => <InlineQueryResultArticle>
              ({
                id: product.Id.toString(),
                type: product.Type,
                // photo_url: "https://cdn.pixabay.com/photo/2015/12/01/20/28/road-1072823_1280.jpg",
                thumb_url: product.ThumbUrl,
                title: product.Title,
                description: product.Description,
                // caption: product.Caption,
                input_message_content: {
                  message_text: product.Id.toString(),
                  //       // message_text:
                  //       //   `<b>🎞️ TesTRTt</b>\n` +
                  //       //   `http://www.youtube.com/watch?v=${'L_Gqpg0q1sfdxs' || ''}`,
                  // parse_mode: 'HTML',
                }
              }
              )

            ),
            { cache_time: 0 }
          )
        }
      } catch (error) {
        //Loglama
        console.log(error);
        await ctx.answerInlineQuery([{
          id: "None",
          type: "article",
          thumb_url: "",
          title: "Bir Hata Oluştu Lütfen Tekrar Deneyiniz",
          description: "Bir Hata Oluştu Lütfen Tekrar Deneyiniz",
          input_message_content: {
            message_text: "Bir Hata Oluştu Lütfen Tekrar Deneyiniz /start",
            //       // message_text:
            //       //   `<b>🎞️ TesTRTt</b>\n` +
            //       //   `http://www.youtube.com/watch?v=${'L_Gqpg0q1sfdxs' || ''}`,
            // parse_mode: 'HTML',
          }
        }],
          { cache_time: 0 })
      }

    });


    bot.on("message", async ctx => {
      if ("text" in ctx.message && ctx.message['via_bot']?.is_bot) {
        if (parseInt(ctx.message.text, 10)) {
          await this.AddToBasketAndComplteOrderOrContinueShopping(ctx);
        }
      }
    });
  }
  async EmptyBasket(ctx: Context) {
    try {
      await this.orderRepository.delete({ userId: ctx.callbackQuery.from.id, Status: OrderStatus.InBasket })
      await ctx.answerCbQuery("Sepetiniz Boşaltılmıştır.");
    } catch (error) {
      //Loglama
      console.log(error);
      await ctx.answerCbQuery("Bir hata oluştu. Lütfen tekrar deneyiniz.")
    }

  }

  async SendOrder(ctx: BotContext) {
    try {
      const userInfo = ctx.from.is_bot ? ctx.callbackQuery.from : ctx.from;
      await this.orderRepository.update({ userId: userInfo.id, Status: OrderStatus.InBasket }, { Status: OrderStatus.UserConfirmed });
      await ctx.answerCbQuery("Siparişiniz Gönderilmiştir");
      await FirstMessageHandler.startOptions(ctx);
    } catch (error) {
      console.log(error)
      await ctx.answerCbQuery("Bir hata oluştu. Lütfen tekrar deneyiniz.")
    }

  }
  async EnterAddress(ctx: BotContext) {
    await ctx.scene.enter('address', await ctx.reply('Lütfen Açık Adresinizi Giriniz. \n Tekrar Ana Menüye dönmek için bu komutu çalıştırınız /iptal'));
  }
  async AddToBasket(ctx: BotContext) {
    await this.AddNewOrder(ctx);
    await StartOrderingCb.StartOrdering(ctx);
  }

  InitlizeWizards(bot: Telegraf<Context>) {
    const addNoteToOrderWizard = this.addNoteToOrderWizard.InitilizeAddnoteToOrderWizard();
    let addressWizard = this.addressWizard.InitilizeAdressWizard();
    const stage = new Scenes.Stage<BotContext>([addressWizard, addNoteToOrderWizard]);
    stage.command('iptal', async (ctx) => {
      await ctx.scene.leave();
      await FirstMessageHandler.startOptions(ctx);
    })
    bot.use(session());
    bot.use(stage.middleware());

  }


  async AddToBasketAndComplteOrderOrContinueShopping(ctx) {
    if ("text" in ctx.message) {
      const selectedProduct = ctx.message.text;

      const user = await this.userRepository.getUser(ctx);
      if (user) {
        // let selectedProducts: string[] = user.SelectedProducts ? JSON.parse(user.SelectedProducts) : [];
        let selectedProducts: string[] = [selectedProduct];
        // selectedProducts.push(ctx.message.text);
        user.SelectedProducts = JSON.stringify(selectedProducts);
        this.userRepository.save(user);
      }

      // Get Prodcut Details From DB and Show Them
      const product = await this.productRepository.findOne({ where: { Id: selectedProduct } });
      await ctx.reply(`<b>${product.Title}</b> \n` + `Açıklama:<i> ${product.Description}</i> \n` + `Fiyat: <u> ${product.UnitPrice} TL</u>`,
        {
          parse_mode: 'HTML',
          reply_markup: {
            one_time_keyboard: true,
            inline_keyboard:
              [
                [{ text: `🛒 Sepete Ekle ve Alışverişe devam et 🛒`, callback_data: CallBackQueryResult.AddToBasket }],
                [{ text: `🛒 Sepete Ekle ve Siarişimi Tamamla ✔️`, callback_data: CallBackQueryResult.AddProductAndCompleteOrder }],
                [{ text: "🍛 Başka Ürün Seç 🍝", callback_data: CallBackQueryResult.StartOrdering }],
                [{ text: "✔️ Siparişimi Tamamla ✔️", callback_data: CallBackQueryResult.CompleteOrder }],
                [{ text: "◀️ Ana Menüye Dön ◀️", callback_data: CallBackQueryResult.MainMenu }]
              ]
          }
        })
    }


  }


  async AddProductAndCompleteOrder(ctx: BotContext) {
    await this.AddNewOrder(ctx);
    await CompleteOrderHandler.CompleteOrder(ctx);

  }


  async AddNewOrder(ctx: BotContext) {
    const user = await this.userRepository.getUser(ctx);
    if (user) {
      console.log("AddNEwOrder")
      let selectedProducts: number[] = user.SelectedProducts ? JSON.parse(user.SelectedProducts) : [];
      if (selectedProducts.length > 0) {

        let order: Order = await this.orderRepository.findOne({ where: { userId: user.Id, Status: OrderStatus.InBasket }, relations: ["OrderDetails"] });
        if (order) {
          selectedProducts.map((Id) => {
            const orderDetails = order.OrderDetails.find((fi) => fi.productId == Id);
            if (orderDetails) {
              order.OrderDetails.find((fi) => fi.productId == Id).Amount += 1;
            } else {
              order.OrderDetails.push({ productId: Id, Amount: 1, OrderId: order.Id, CreateDate: new Date() });
            }
          });
        } else {
          const guid = Guid.create().toString();
          order = new Order();
          order = { CreateDate: new Date(), Status: OrderStatus.InBasket, userId: user.Id, Id: guid };
          order.OrderDetails = [];
          selectedProducts.map((Id) => {
            order.OrderDetails.push({ productId: Id, Amount: 1, OrderId: guid, CreateDate: new Date() });
          });

        }
        await this.orderRepository.save(order);
        await this.orderDetailsRepository.save(order.OrderDetails);
        user.SelectedProducts = null;
        await this.userRepository.update({ Id: user.Id }, user);
      }
    }
  }

  async addNoteToOrder(ctx: BotContext) {
    const orderInBasket = await this.orderRepository.getOrdersInBasketByStatus(ctx, OrderStatus.InBasket, ['OrderDetails']);
    if (orderInBasket.OrderDetails.length > 0) {
      ctx.scene.enter('AddNoteToOrder', ctx.reply("Lütfen Eklemek İstediğiniz notu giriniz... \n Tekrar Ana Menüye dönmek için bu komutu çalıştırınız /iptal"))
    } else {
      await ctx.answerCbQuery("Sepetiniz Boştur.");
    }

  }
}