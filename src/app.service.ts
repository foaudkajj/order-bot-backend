import { Injectable, OnModuleInit } from '@nestjs/common';
import Telegraf, { Context, session, Stage } from 'telegraf';
import { TelegrafContext } from 'telegraf/typings/context';
import { InlineQueryResult, InlineQueryResultArticle, User } from 'telegraf/typings/telegram-types';
import { getRepository, Repository } from 'typeorm';
import { CallBackQueryResult } from './bot/models/CallBackQueryResult';
import { AddressWizardService } from './bot/wiards/address-wizard.service';
import { OrderStatus } from './DB/enums/OrderStatus';
import { Order } from './DB/models/Order';
import { Product } from './DB/models/Product';
import { TelegramUser } from './DB/models/TelegramUser';

@Injectable()
export class AppService implements OnModuleInit {
  userRepository: Repository<TelegramUser> = getRepository(TelegramUser);
  orderRepository: Repository<Order> = getRepository(Order);
  productRepository: Repository<Product> = getRepository(Product);
  constructor(private addressWizard: AddressWizardService) {

  }
  onModuleInit() {
    this.InitlizeAndLunchBot();
  }
  getHello(): string {
    return 'Hello World!';
  }

  InitlizeAndLunchBot() {
    const bot = new Telegraf("1572537123:AAHs1SWycLVjjdgwWFkDRrMDegJBLf5rfvs");

    this.InitlizeWizards(bot);

    this.InilizeBotEventsHandlers(bot);

    bot.launch();
  }
  InilizeBotEventsHandlers(bot: Telegraf<Context>) {
    bot.command("start",
      async ctx => await this.startOptions(ctx)
    );


    bot.on("callback_query", async ctx => {
      switch (ctx.callbackQuery.data) {

        case CallBackQueryResult.StartOrdering:
          await ctx.answerCbQuery();
          await this.StartOrdering(ctx);
          break;

        case CallBackQueryResult.AddProductAndCompleteOrder:
          await ctx.answerCbQuery();
          await this.AddProductAndCompleteOrder(ctx as ExtendedTelegrafContext);
          break;

        case CallBackQueryResult.CompleteOrder:
          await this.CompleteOrder(ctx as ExtendedTelegrafContext);
          break;


        case CallBackQueryResult.AddToBasket:
          await ctx.answerCbQuery();
          await this.AddToBasket(ctx);
          break;

        case CallBackQueryResult.EnterAddress:
          await ctx.answerCbQuery();
          await this.EnterAddress(ctx as ExtendedTelegrafContext);
          break;

        case CallBackQueryResult.SendOrder:
          await ctx.answerCbQuery();
          await this.SendOrder(ctx);
          break;

        case CallBackQueryResult.MyOrders:
          const orderDetails = await this.GetOrdersInBasket(ctx);
          await this.ShowProductCategories(ctx, orderDetails);
          break;

        case CallBackQueryResult.ConfirmOrder:
          await ctx.answerCbQuery();
          await this.ConfirmOrder(ctx);
          break;


        case CallBackQueryResult.EmptyBakset:
          await this.EmptyBasket(ctx);
          break;

        case CallBackQueryResult.MainMenu:
          await ctx.answerCbQuery();
          await this.startOptions(ctx);
          break;

        case CallBackQueryResult.TrackOrder:
          await ctx.answerCbQuery("Bu Özellik Yapım Aşamasındadır");
          break;

        default:
          break;
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
      if (ctx.message['via_bot']?.is_bot) {
        if (parseInt(ctx.message.text, 10)) {
          await this.AddToBasketAndComplteOrderOrContinueShopping(ctx);
        }
      }
    });
  }
  async EmptyBasket(ctx: Context) {
    try {
      await this.orderRepository.delete({ userId: ctx.from.id, Status: OrderStatus.Given })
      await ctx.answerCbQuery("Sepetiniz Boşaltılmıştır.");
      await this.startOptions(ctx);
    } catch (error) {
      //Loglama
      console.log(error);
      await ctx.answerCbQuery("Bir hata oluştu. Lütfen tekrar deneyiniz.")
    }

  }
  async ConfirmOrder(ctx: Context) {
    let orderDetails = await this.GetOrdersInBasket(ctx);
    const orders = orderDetails === "" ? 'Lütfen bir ürün seçiniz' : orderDetails;
    await ctx.reply('📍 Adresiniz Alınmıştır.📍 \n\n' + `<b>Sipariş Özeti</b>:\n` + orders,
      {
        parse_mode: 'HTML',
        reply_markup: {
          one_time_keyboard: true,
          inline_keyboard:
            [
              [{ text: "👌 Siparişimi Onayla 👌", callback_data: CallBackQueryResult.SendOrder }],
              [{ text: "◀️ Ana Menüye Dön ◀️", callback_data: CallBackQueryResult.MainMenu }]
            ]
        }
      });
  }
  async SendOrder(ctx: Context) {

    await this.orderRepository.update({ userId: ctx.from.id }, { Status: OrderStatus.Accepted });
    ctx.reply("Siparişiniz Gönderilmiştir");
    // Ana Sayfaya Yönlendir
  }
  EnterAddress(ctx: ExtendedTelegrafContext) {
    ctx.scene.enter('address');
  }
  async AddToBasket(ctx: TelegrafContext) {
    await this.AddNewOrder(ctx);
    await this.StartOrdering(ctx);
  }
  async startOptions(ctx: Context) {
    await this.createNewUserIfUserDoesnitExist(ctx);
    return await ctx.reply('Hoş Geldiniz , \n Sipariş vermeniz için ben size yardımcı olacağım.',
      {
        reply_markup: {
          one_time_keyboard: true,
          inline_keyboard:
            [
              [{ text: "🥘 Sipariş Ver 🥘", callback_data: CallBackQueryResult.StartOrdering }],
              [{ text: "🚚 Siparişini Takip Et 🚚", callback_data: CallBackQueryResult.TrackOrder }],
              [{ text: "🗑 Sepetem 🗑", callback_data: CallBackQueryResult.MyOrders }],
              [{ text: "🗑 Sepetemi Boşalt 🗑", callback_data: CallBackQueryResult.EmptyBakset }],
              [{ text: "✔️ Siparişimi Tamamla ✔️", callback_data: CallBackQueryResult.CompleteOrder }],
            ]
        }
      })
  }
  async createNewUserIfUserDoesnitExist(ctx: Context) {
    const user = await this.userRepository.findOne(ctx.from.id);
    if (!user) {
      const newUser: TelegramUser = { Id: ctx.from.id, FirstName: ctx.from.first_name, LastName: ctx.from.last_name, Username: ctx.from.username };
      await this.userRepository.save(newUser);
    }

  }
  InitlizeWizards(bot: Telegraf<Context>) {
    let addressWizard = this.addressWizard.InitilizeAdressWizard();
    const stage = new Stage([addressWizard]);
    stage.command('iptal', async (ctx) => {
      await ctx.scene.leave();
      await this.startOptions(ctx);
    })
    bot.use(session());
    bot.use(stage.middleware());

  }

  async StartOrdering(ctx: TelegrafContext) {
    let user = await this.getUser(ctx.from);
    user.SelectedProducts = null;
    await this.userRepository.update({ Id: user.Id }, user);

    let orderDetails = await this.GetOrdersInBasket(ctx);
    await this.ShowProductCategories(ctx, orderDetails);


  }
  async ShowProductCategories(ctx: Context, orderDetails: string) {
    try {
      const orders = orderDetails === "" ? 'Lütfen bir ürün seçiniz' : orderDetails;
      await ctx.editMessageText(orders,
        {
          parse_mode: "HTML",
          reply_markup: {
            one_time_keyboard: true,
            inline_keyboard:
              [
                [{ text: "🍖 Kebap 🍢", switch_inline_query_current_chat: 'Kebap' }],
                [{ text: "🥤 İçecek 🍸", switch_inline_query_current_chat: "\u0130\u00E7ecek" }],
                [{ text: "🍲 Çorba 🥣", switch_inline_query_current_chat: "\u00C7orba" }],
                [{ text: "🍬 Tatlı 🍬", switch_inline_query_current_chat: "Tatl\u0131" }],
                [{ text: "◀️ Ana Menüye Dön ◀️", callback_data: CallBackQueryResult.MainMenu }]
              ]
          }
        });
    } catch (error) {
      //Loglama
      console.log(error);
    }

  }
  async GetOrdersInBasket(ctx: TelegrafContext) {
    let orderDetails = '';
    try {
      const ordersInBasket = await this.orderRepository.find({ where: { userId: ctx.from.id, Status: OrderStatus.Given }, relations: ['Product'] });
      if (ordersInBasket.length == 0) {
        orderDetails = 'Sepetinizde Ürün Yoktur.\n Lütfen ürün seçiniz.\n\n';
        await ctx.answerCbQuery("Sepetiniz Boştur. Lütfen Ürün Seçiniz");
      } else {
        let TotalPrice = ordersInBasket.map(value => value.Product.UnitPrice * (value.Amount > 0 ? value.Amount : 1)).reduce((previous, current) => previous + current);
        orderDetails = 'Sepetinizdeki Ürünler:\n\n';
        ordersInBasket.forEach(order => {
          orderDetails = orderDetails.concat(`Ürün İsmi : ${order.Product.Title}\n`, `Fiyat: <u> ${order.Product.UnitPrice} TL</u>\n`, `Miktar : ${order.Amount}\n`, `Açıklama : ${order.Description ?? "Yok"}` + '\n\n');
        });
        orderDetails = orderDetails.concat(`\n\n Toplam: ${TotalPrice} TL`);
        await ctx.answerCbQuery();
      }

    } catch (error) {
      //Loglama
      console.log(error);
      await ctx.answerCbQuery("Bir hata oluştu. Lütfen tekrar deneyiniz.")
    }


    return orderDetails;
  }

  async AddToBasketAndComplteOrderOrContinueShopping(ctx: TelegrafContext) {
    const selectedProduct = ctx.message.text;

    const user = await this.getUser(ctx.from);
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
  async getUser(from: User, relations?: string[]) {
    if (relations && relations.length > 0) {
      return await this.userRepository.findOne(from.id, { relations: relations });
    } else
      return await this.userRepository.findOne(from.id);
  }

  async AddProductAndCompleteOrder(ctx: ExtendedTelegrafContext) {
    await this.AddNewOrder(ctx);
    await this.CompleteOrder(ctx);

  }
  async CompleteOrder(ctx: ExtendedTelegrafContext) {
    try {
      const user = await this.getUser(ctx.from, ["Orders"]);
      const orders = await user.Orders;

      if (orders.length > 0) {
        await ctx.answerCbQuery();
        if (user.Address) {


          if (user.Location) {
            const location = JSON.parse(user.Location);
            await ctx.replyWithLocation(
              location.latitude,
              location.longitude
            );
          }


          await ctx.replyWithMarkdown(`<i>${user.Address}</i> \n \n`
            + '<b>Kayıtlı olan adres ve konumunuz mu kullanalım?</b> \n \n'
            + '<b>Note:</b> Açık adres ile konumun uyuşmadığı tadirde, açık adres kullanılacaktır.',
            {
              parse_mode: 'HTML',
              reply_markup: {
                inline_keyboard:
                  [
                    [
                      { text: 'Evet', callback_data: CallBackQueryResult.ConfirmOrder },
                      { text: 'Hayır', callback_data: CallBackQueryResult.EnterAddress }
                    ]
                  ]
              }
            });
        } else {
          ctx.scene.enter('address');
        }
      } else {
        await ctx.answerCbQuery("Sepetiniz Boştur. Lütfen Ürün Seçiniz");
        await this.ShowProductCategories(ctx, "")
      }
    } catch (error) {
      //Loglama
      console.log(error);
      await ctx.answerCbQuery("Bir hata oluştu. Lütfen tekrar deneyiniz. /start")
    }

  }

  async AddNewOrder(ctx: TelegrafContext) {
    const user = await this.getUser(ctx.from);
    if (user) {
      let selectedProducts: number[] = user.SelectedProducts ? JSON.parse(user.SelectedProducts) : [];
      if (selectedProducts.length > 0) {
        const orderDetails: Order[] = await this.orderRepository.find({ where: { userId: user.Id, Status: OrderStatus.Given } });
        selectedProducts.map((Id) => {
          const order = orderDetails.find((fi) => fi.productId == Id)
          if (order) {
            orderDetails.find((fi) => fi.productId == Id).Amount += 1;
          } else {
            orderDetails.push({ productId: Id, Amount: 1, userId: user.Id, CreateDate: new Date() });
          }
        });
        user.SelectedProducts = null;
        await this.userRepository.update({ Id: user.Id }, user);
        await this.orderRepository.save(orderDetails);
      }
    }
  }
}


export interface ExtendedTelegrafContext extends Context {
  session: any;
  scene: any;
  wizard: Wizrd;
}

type Wizrd = { back: () => any, next: () => any, steps: any, cursor: any }