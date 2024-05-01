import {Injectable, OnModuleInit} from '@nestjs/common';
import {
  Order,
  OrderChannel,
  OrderItem,
  OrderStatus,
  PaymentMethod,
  ProductStatus,
} from 'src/models';
import {
  CategoryRepository,
  CustomerRepository,
  MerchantRepository,
  OrderItemRepository,
  OrderRepository,
  ProductRepository,
} from 'src/db/repositories';
import {
  CompleteOrderHandler,
  ConfirmOrderHandler,
  FirstMessageHandler,
  GetConfirmedOrderCb,
  OrdersInBasketCb,
  StartOrderingCb,
} from './helpers';
import {CallBackQueryResult} from './models/enums';
import {
  AddnoteToOrderWizardService,
  AddressWizardService,
  PhoneNumberWizardService,
} from './wizards';
import {safeJsonParse} from 'src/shared/utils';
import {CallbackQueryData} from './interfaces/callback-query-data';
import {BotContext} from './interfaces';
import {InlineQueryResultArticle} from '@telegraf/types';
import {Composer, Scenes, Telegraf, session} from 'telegraf';
import {Like} from 'typeorm/find-options/operator/Like';
import {BotCommands} from './bot-commands';
import {DataSource, In} from 'typeorm';

@Injectable()
export class BotService implements OnModuleInit {
  constructor(
    private addressWizard: AddressWizardService,
    private addNoteToOrderWizard: AddnoteToOrderWizardService,
    private phoneNumberService: PhoneNumberWizardService,
    private categoryRepository: CategoryRepository,
    private productRepository: ProductRepository,
    private orderItemRepository: OrderItemRepository,
    private customerRepository: CustomerRepository,
    private orderRepository: OrderRepository,
    private merchantRepository: MerchantRepository,
    private fmh: FirstMessageHandler,
    private completeOrderHandler: CompleteOrderHandler,
    private confirmOrderHandler: ConfirmOrderHandler,
    private getConfirmedOrderCb: GetConfirmedOrderCb,
    private ordersInBasketCb: OrdersInBasketCb,
    private startOrderingCb: StartOrderingCb,
    private dataSource: DataSource,
  ) {}

  static botMap = new Map<string, Telegraf<BotContext>>();

  onModuleInit() {
    this.InitlizeAndLunchBot();
  }

  composer = new Composer<BotContext>();

  async InitlizeAndLunchBot() {
    const merchantList = await this.merchantRepository.orm.find({
      where: {isActive: true},
    });

    this.InitlizeWizards(this.composer);
    this.InilizeBotEventsHandlers(this.composer);

    const isProd = process.env.NODE_ENV === 'production';

    for await (const merchant of merchantList) {
      // the following if-else block is used to prevent running the same bots on prod and test environments.
      if (isProd) {
        if (merchant.id === 1) {
          merchant.botToken = null;
        }
      } else {
        if (merchant.id === 2) {
          merchant.botToken = null;
        }
      }

      if (merchant.botToken) {
        const bot = new Telegraf<BotContext>(merchant.botToken);

        bot.use(this.composer);
        bot.launch(() => {
          console.log(`Bot started. Merchant: ${merchant.botUserName}`);
          BotService.botMap.set(bot.botInfo.username, bot);
        });
        process.once('SIGINT', () => {
          bot.stop('SIGINT');
          console.log('Bot stopped: ', merchant.botUserName);
        });
        process.once('SIGTERM', () => {
          bot.stop('SIGTERM');
          console.log('Bot stopped: ', merchant.botUserName);
        });
      }
    }
  }

  InilizeBotEventsHandlers(composer: Composer<BotContext>) {
    composer.command('start', async ctx => await this.fmh.startOptions(ctx));
    composer.on('callback_query', async ctx => {
      try {
        if ('data' in ctx.callbackQuery && ctx.callbackQuery.data) {
          const callbackQueryData = safeJsonParse<CallbackQueryData>(
            ctx.callbackQuery.data,
          );
          switch (callbackQueryData.action) {
            case CallBackQueryResult.StartOrdering:
              await ctx.answerCbQuery();
              await this.startOrderingCb.StartOrdering(ctx);
              break;
            // case CallBackQueryResult.AddProductAndCompleteOrder:
            //   await ctx.answerCbQuery();
            //   await this.AddProductAndCompleteOrder(ctx);
            //   break;
            case CallBackQueryResult.CompleteOrder:
              await this.askForPhoneNumberIfNotAvailable(ctx);
              break;
            case CallBackQueryResult.AddToBasketAndContinueShopping:
              await ctx.answerCbQuery();
              await this.AddProdToBasket(
                ctx,
                Number.parseInt(callbackQueryData.data.selectedProductId),
              );
              await this.startOrderingCb.StartOrdering(ctx);
              break;
            case CallBackQueryResult.EnterAddress:
              await ctx.answerCbQuery();
              await this.EnterAddress(ctx);
              break;
            case CallBackQueryResult.SendOrder:
              await this.SendOrder(ctx);
              break;
            case CallBackQueryResult.MyBasket:
              {
                const orderDetails =
                  await this.ordersInBasketCb.GetOrdersInBasketByStatus(
                    ctx,
                    OrderStatus.New,
                  );
                if (orderDetails != null) {
                  await ctx.editMessageText(orderDetails, {
                    parse_mode: 'HTML',
                    reply_markup: {
                      // one_time_keyboard: true,
                      inline_keyboard: BotCommands.getCustom([
                        {action: CallBackQueryResult.StartOrdering},
                        {action: CallBackQueryResult.ConfirmOrder},
                        {action: CallBackQueryResult.EmptyBakset},
                        {action: CallBackQueryResult.CompleteOrder},
                        {action: CallBackQueryResult.MainMenu},
                      ]),
                    },
                  });
                }
              }
              break;
            case CallBackQueryResult.ConfirmOrder:
              await this.confirmOrderHandler.ConfirmOrder(ctx);
              // await this.fmh.startOptions(ctx);
              break;
            case CallBackQueryResult.EmptyBakset:
              await this.EmptyBasket(ctx);
              break;
            case CallBackQueryResult.MainMenu:
              await ctx.answerCbQuery();
              await this.fmh.startOptions(ctx);
              break;
            case CallBackQueryResult.TrackOrder:
              await ctx.answerCbQuery('Bu Özellik Yapım Aşamasındadır');
              break;
            case CallBackQueryResult.AddNoteToOrder:
              await this.addNoteToOrder(ctx);
              break;
            case CallBackQueryResult.GetConfirmedOrders:
              await this.getConfirmedOrderCb.GetConfirmedOrders(ctx);
              // await this.fmh.startOptions(ctx);
              break;
            default:
              await ctx.answerCbQuery();
              break;
          }
        }
      } catch (e) {
        console.log(e);
        await ctx.answerCbQuery();
      }
      // if ("data" in ctx.callbackQuery && ctx.callbackQuery.data) {
      //   console.log(ctx.callbackQuery.from.id)
      // }
    });
    composer.on('inline_query', async ctx => {
      try {
        const customer =
          await this.customerRepository.getCustomerByTelegramId(ctx);
        if (customer) {
          const category = await this.categoryRepository.orm.findOne({
            where: {
              categoryKey: Like(ctx.inlineQuery.query),
              merchantId: customer.merchantId,
            },
            relations: {products: true},
          });
          await ctx.answerInlineQuery(
            category?.products?.map(
              product =>
                <InlineQueryResultArticle>{
                  id: product.id.toString(),
                  type: 'article',
                  thumb_url: product.thumbUrl,
                  title: product.title,
                  description: product.description,
                  // caption: product.Caption,
                  input_message_content: {
                    message_text: product.id.toString(),
                    //       // message_text:
                    //       //   `<b>🎞️ TesTRTt</b>\n` +
                    //       //   `http://www.youtube.com/watch?v=${'L_Gqpg0q1sfdxs' || ''}`,
                    // parse_mode: 'HTML',
                  },
                },
            ),
            {cache_time: 0},
          );
        }
      } catch (error) {
        // Loglama
        console.log(error);
        await ctx.answerInlineQuery(
          [
            {
              id: 'None',
              type: 'article',
              // thumb_url: '',
              title: 'Bir Hata Oluştu Lütfen Tekrar Deneyiniz',
              description: 'Bir Hata Oluştu Lütfen Tekrar Deneyiniz',
              input_message_content: {
                message_text: 'Bir Hata Oluştu Lütfen Tekrar Deneyiniz /start',
                //       // message_text:
                //       //   `<b>🎞️ TesTRTt</b>\n` +
                //       //   `http://www.youtube.com/watch?v=${'L_Gqpg0q1sfdxs' || ''}`,
                // parse_mode: 'HTML',
              },
            },
          ],
          {cache_time: 0},
        );
      }
    });

    composer.on('message', async ctx => {
      try {
        if ('text' in ctx.message && ctx.message.via_bot?.is_bot) {
          if (parseInt(ctx.message.text, 10)) {
            await this.AddToBasketAndComplteOrderOrContinueShopping(ctx);
          }
        }
      } catch (e) {
        console.log(e);
      }
    });
  }

  async EmptyBasket(ctx: BotContext) {
    try {
      const order =
        await this.orderRepository.getOrderInBasketByTelegramId(ctx);
      if (order) {
        await this.orderRepository.orm.delete({id: order.id});
        await ctx.answerCbQuery('Sepetiniz Boşaltılmıştır.');
      } else {
        await ctx.answerCbQuery('Sepetiniz Boştur.');
      }
    } catch (error) {
      // Loglama
      console.log(error);
      await ctx.answerCbQuery('Bir hata oluştu. Lütfen tekrar deneyiniz.');
    }
  }

  async SendOrder(ctx: BotContext) {
    try {
      // const userInfo = ctx.from.is_bot ? ctx.callbackQuery.from : ctx.from;
      const customer =
        await this.customerRepository.getCustomerByTelegramId(ctx);
      await this.orderRepository.orm.update(
        {customerId: customer.id, orderStatus: OrderStatus.New},
        {orderStatus: OrderStatus.UserConfirmed},
      );
      await ctx.answerCbQuery('Siparişiniz Gönderilmiştir');
      await this.fmh.startOptions(ctx);
    } catch (error) {
      console.log(error);
      await ctx.answerCbQuery('Bir hata oluştu. Lütfen tekrar deneyiniz.');
    }
  }

  async EnterAddress(ctx: BotContext) {
    await ctx.scene.enter(
      'address',
      // await ctx.reply(
      //   'Lütfen Açık Adresinizi Giriniz. \n Tekrar Ana Menüye dönmek için bu komutu çalıştırınız /iptal',
      // ),
    );
  }

  InitlizeWizards(composer: Composer<BotContext>) {
    const addNoteToOrderWizard =
      this.addNoteToOrderWizard.InitilizeAddnoteToOrderWizard();
    const addressWizard = this.addressWizard.InitilizeAdressWizard();
    const phoneNumber = this.phoneNumberService.InitilizePhoneNumberWizard();
    const stage = new Scenes.Stage<BotContext>([
      addressWizard,
      addNoteToOrderWizard,
      phoneNumber,
    ]);
    stage.command('iptal', async ctx => {
      await ctx.scene.leave();
      await this.fmh.startOptions(ctx);
    });
    composer.use(session());
    composer.use(stage.middleware());
  }

  async AddToBasketAndComplteOrderOrContinueShopping(ctx: BotContext) {
    if ('text' in ctx.message) {
      const selectedProductId = ctx.message.text;

      const customer =
        await this.customerRepository.getCustomerByTelegramId(ctx);

      // Get Prodcut Details From DB and Show Them
      const product = await this.productRepository.orm.findOne({
        where: {
          id: Number.parseInt(selectedProductId),
          merchantId: customer.merchantId,
        },
      });
      await ctx.reply(
        `<b>${product.title}</b> \n` +
          `Açıklama:<i> ${product.description}</i> \n` +
          `Fiyat: <u> ${product.unitPrice} TL</u>`,
        {
          parse_mode: 'HTML',
          reply_markup: {
            one_time_keyboard: true,
            inline_keyboard: BotCommands.getCustom([
              {
                action: CallBackQueryResult.AddToBasketAndContinueShopping,
                data: {selectedProductId},
              },

              {
                action: CallBackQueryResult.StartOrdering,
                text: 'Başka bir ürün seç',
              },
              {
                action: CallBackQueryResult.CompleteOrder,
              },
              {
                action: CallBackQueryResult.MainMenu,
              },
            ]),
          },
        },
      );
    }
  }

  // async AddProductAndCompleteOrder(ctx: BotContext) {
  //   await this.AddNewOrder(ctx);
  //   await CompleteOrderHandler.CompleteOrder(ctx);
  // }

  /**
   * Creates an order if not exists and adds the selected product to the basket.
   * @param ctx
   * @param selectedProductId
   */
  async AddProdToBasket(ctx: BotContext, selectedProductId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let order = await this.orderRepository.getOrderInBasketByTelegramId(ctx, {
        orderItems: true,
      });

      if (order) {
        const selectedProduct = (order.orderItems ?? []).find(
          (orderItem: OrderItem) => orderItem.productId === selectedProductId,
        );

        if (selectedProduct) {
          selectedProduct.amount = selectedProduct.amount + 1;
        } else {
          order.orderItems.push(<OrderItem>{
            amount: 1,
            productId: selectedProductId,
            productStatus: ProductStatus.InBasket,
          });
        }

        await queryRunner.manager.save(Order, order);
      } else {
        const customer =
          await this.customerRepository.getCustomerByTelegramId(ctx);
        order = {
          customerId: customer.id,
          merchantId: customer.merchantId,
          orderNo: new Date().getTime().toString(36),
          createDate: new Date(),
          orderChannel: OrderChannel.Telegram,
          orderStatus: OrderStatus.New,
          paymentMethod: PaymentMethod.OnDelivery,
          totalPrice: 0,
          orderItems: [
            <OrderItem>{
              amount: 1,
              productId: selectedProductId,
              productStatus: ProductStatus.InBasket,
            },
          ],
        };

        await queryRunner.manager.save(Order, order);
      }

      const products = await this.productRepository.orm.find({
        where: {id: In(order.orderItems?.map(oi => oi.productId) ?? [])},
      });

      const selectedProductsPrice = order.orderItems.map(oi => {
        const product = products.find(p => p.id === oi.productId);
        return oi.amount * product.unitPrice;
      });
      // update the total price of the order.
      order.totalPrice = selectedProductsPrice.reduce(
        (totalPrice, amount) => totalPrice + amount,
        0,
      );

      await queryRunner.manager.save(Order, order);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async addNoteToOrder(ctx: BotContext) {
    const order = await this.orderRepository.getOrdersInBasketByStatus(
      ctx,
      OrderStatus.New,
    );
    if (order) {
      ctx.scene.enter(
        'AddNoteToOrder',
        // ctx.reply(
        //   'Lütfen Eklemek İstediğiniz notu giriniz... \n Tekrar Ana Menüye dönmek için bu komutu çalıştırınız /iptal',
        // ),
      );
    } else {
      await ctx.answerCbQuery('Sepetiniz Boştur.');
    }
  }

  async askForPhoneNumberIfNotAvailable(ctx: BotContext) {
    const customer = await this.customerRepository.getCustomerByTelegramId(ctx);
    if (!customer.phoneNumber) {
      await ctx.scene.enter(
        'phone-number',
        // await ctx.reply('Lütfen telefon numarınızı gönderiniz. /iptal', {
        //   reply_markup: {
        //     keyboard: [
        //       [
        //         {
        //           request_contact: true,
        //           text:
        //             'Bu butona tıklayarak telefon numaranızı gönderebilirsiniz.',
        //         },
        //       ],
        //     ],
        //     one_time_keyboard: true,
        //   },
        // }),
      );
    } else {
      await this.completeOrderHandler.CompleteOrder(ctx);
    }
  }
}
