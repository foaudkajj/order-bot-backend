import { Injectable, OnModuleInit } from '@nestjs/common';
import Telegraf, { Context, session, Stage } from 'telegraf';
import { TelegrafContext } from 'telegraf/typings/context';
import { CallBackQueryResult } from './bot/models/CallBackQueryResult';
import { AddressWizardService } from './bot/wiards/address-wizard.service';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private addressWizard: AddressWizardService) {

  }
  onModuleInit() {
    this.InitlizeAndLunchBot();
  }
  getHello(): string {
    return 'Hello World!';
  }

  InitlizeAndLunchBot() {
    const bot = new Telegraf("1485687554:AAFbN5pD2h5hzi9o9eydQjh6l4RcVYTtp5c");
    this.InitlizeWizards(bot);
    bot.command("start",
      async ctx => await this.startOptions(ctx)
    );


    bot.on("callback_query", async ctx => {
      await ctx.answerCbQuery();
      switch (ctx.callbackQuery.data) {

        case CallBackQueryResult.MakeOrder:
          await this.MakeOrderReply(ctx);
          break;

        case CallBackQueryResult.OrderDetails:
          await this.OrderDetails(ctx as ExtendedTelegrafContext);
          break;

        default:
          break;
      }
    });

    bot.on("inline_query", async (ctx) => {
      // ctx.inlineQuery.query
      // DBye istek atilir ve query e gore (query: 'kebab') result doner
      // console.log(ctx.inlineQuery)
      await ctx.answerInlineQuery([
        {
          id: 'test',
          type: 'article',
          photo_url: "https://cdn.pixabay.com/photo/2015/12/01/20/28/road-1072823_1280.jpg",
          thumb_url: 'http://siparisbotu.mfuatnuroglu.com/thumbs/1.webp',
          title: 'Patlıcan Kebabı',
          description: 'Çok Lezzetli Patlıcan Kebabı',
          caption: "Cajption",
          input_message_content: {
            message_text: "HelloTT"
            // message_text:
            //   `<b>🎞️ TesTRTt</b>\n` +
            //   `http://www.youtube.com/watch?v=${'L_Gqpg0q1sfdxs' || ''}`,
            // parse_mode: 'HTML',
          }
        },
        {
          id: 'test1',
          type: 'article',
          thumb_url: 'http://siparisbotu.mfuatnuroglu.com/thumbs/2.webp',
          title: 'Menemen',
          description: 'Çok Lezzetli Menemen',
          input_message_content: {
            message_text: "HelloTT"
            // message_text:
            //   `<b>🎞️ TesTRTt</b>\n` +
            //   `http://www.youtube.com/watch?v=${'L_Gqpg0q1sfdxs' || ''}`,
            // parse_mode: 'HTML',
          },
        },
        {
          type: 'article',
          id: 'test2',
          thumb_url: 'http://siparisbotu.mfuatnuroglu.com/thumbs/3.webp',
          title: 'Menemen',
          description: 'Çok Lezzetli Menemen',
          input_message_content: {
            message_text:
              `<b>🎞️ TesTRTt</b>\n` +
              `http://www.youtube.com/watch?v=${'L_Gqpg0q1sfdxs' || ''}`,
            parse_mode: 'HTML',
          },
        },
        {
          type: 'article',
          id: 'test3',
          thumb_url: 'http://siparisbotu.mfuatnuroglu.com/thumbs/4.webp',
          title: 'Menemen',
          description: 'Çok Lezzetli Menemen',
          input_message_content: {
            message_text:
              `<b>🎞️ TesTRTt</b>\n` +
              `http://www.youtube.com/watch?v=${'L_Gqpg0q1sfdxs' || ''}`,
            parse_mode: 'HTML',
          },
        },
        {
          type: 'article',
          id: 'test4',
          thumb_url: 'http://siparisbotu.mfuatnuroglu.com/thumbs/5.webp',
          title: 'Menemen',
          description: 'Çok Lezzetli Menemen',
          input_message_content: {
            message_text:
              `<b>🎞️ TesTRTt</b>\n` +
              `http://www.youtube.com/watch?v=${'L_Gqpg0q1sfdxs' || ''}`,
            parse_mode: 'HTML',
          },
        },
        {
          type: 'article',
          id: 'test5',
          thumb_url: 'http://siparisbotu.mfuatnuroglu.com/thumbs/6.webp',
          title: 'Menemen',
          description: 'Çok Lezzetli Menemen',
          input_message_content: {
            message_text:
              `<b>🎞️ TesTRTt</b>\n` +
              `http://www.youtube.com/watch?v=${'L_Gqpg0q1sfdxs' || ''}`,
            parse_mode: 'HTML',
          },
        }
      ], { cache_time: 0 })
    });


    bot.on("message", ctx => {
      if (ctx.message['via_bot']?.is_bot) {
        this.AddToBasketAndComplteOrderOrContinueShopping(ctx);
      }
    });

    bot.launch();
  }
  async startOptions(ctx: TelegrafContext) {
    return await ctx.reply('Hoş Geldiniz , \n Sipariş vermeniz için ben size yardımcı olacağım.',
      {
        reply_markup: {
          inline_keyboard:
            [
              [{ text: "🥘 Sipariş Ver 🥘", callback_data: CallBackQueryResult.MakeOrder }],
              [{ text: "🚚 Siparişini Takip Et 🚚", callback_data: CallBackQueryResult.TrackOrder }],
              [{ text: "🗑 Sepetem 🗑", callback_data: CallBackQueryResult.MyOrders }],
            ]
        }
      })
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

  async MakeOrderReply(ctx: TelegrafContext) {
    //Category. Id | text | query
    await ctx.reply('Nasıl Bir Şey İstiyorsunuz? , \n İstediğiniz çeşidi seçip sepete ekleyeiniz.',
      {
        reply_markup: {
          inline_keyboard:
            [
              [{ text: "🍖 Kebap 🍢", switch_inline_query: 'Kebap' }],
              [{ text: "🥤 İçecek 🍸", switch_inline_query_current_chat: "\u0130\u00E7ecek" }],
              [{ text: "🍲 Çorba 🥣", switch_inline_query_current_chat: "\u00C7orba" }],
              [{ text: "🍬 Tatlı 🍬", switch_inline_query_current_chat: "Tatl\u0131" }]
            ]
        }
      });

  }

  async AddToBasketAndComplteOrderOrContinueShopping(ctx: TelegrafContext) {
    await ctx.reply('Sipariş Detayları',
      {
        reply_markup: {
          inline_keyboard:
            [
              [{ text: `Sepete Ekle ve Siarişimi Tamamla`, callback_data: CallBackQueryResult.OrderDetails }],
              [{ text: "Başka Ürün Ekle", callback_data: CallBackQueryResult.MakeOrder }]
            ]
        }
      })
  }

  async AddProductToBasket(ctx: TelegrafContext) {

  }

  async OrderDetails(ctx: ExtendedTelegrafContext) {
    ctx.scene.enter('address');

  }
}


export interface ExtendedTelegrafContext extends TelegrafContext {
  session: any;
  scene: any;
  wizard: Wizrd;
}

type Wizrd = { back: () => any, next: () => any, steps: any, cursor: any }