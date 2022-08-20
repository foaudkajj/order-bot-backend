import {Injectable, OnModuleInit} from '@nestjs/common';
import {
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
import {BotContext} from './interfaces/bot-context';
import {CallBackQueryResult} from './models/enums';
import {
  AddnoteToOrderWizardService,
  AddressWizardService,
  PhoneNumberWizardService,
} from './wizards';
import {Composer, Scenes, session, Telegraf} from 'telegraf';
import {InlineQueryResultArticle} from 'telegraf/typings/core/types/typegram';
import {Like} from 'typeorm';

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
  ) {}

  static botMap: Map<string, Telegraf<BotContext>> = new Map<
    string,
    Telegraf<BotContext>
  >();

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

    for await (const merchant of merchantList) {
      if (merchant.botToken) {
        const bot: Telegraf<BotContext> = new Telegraf<BotContext>(
          merchant.botToken,
        );

        bot.use(this.composer);
        await bot.launch();
        BotService.botMap.set(bot.botInfo.username, bot);
      }
    }
  }

  InilizeBotEventsHandlers(composer: Composer<BotContext>) {
    composer.command('start', async ctx => await this.fmh.startOptions(ctx));

    composer.on('callback_query', async ctx => {
      try {
        if ('data' in ctx.callbackQuery && ctx.callbackQuery.data) {
          switch (ctx.callbackQuery.data) {
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
              await this.AddToBasketAndContinueShopping(ctx);
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
                      inline_keyboard: [
                        [
                          {
                            text: '🥘 Sipariş Ver 🥘',
                            callback_data: CallBackQueryResult.StartOrdering,
                          },
                        ],
                        [
                          {
                            text: '🚚 Siparişini Takip Et 🚚',
                            callback_data:
                              CallBackQueryResult.GetConfirmedOrders,
                          },
                        ],
                        // [{ text: "🗑 Sepetem 🗑", callback_data: CallBackQueryResult.MyBasket }],
                        [
                          {
                            text: '🗑 Sepetemi Boşalt 🗑',
                            callback_data: CallBackQueryResult.EmptyBakset,
                          },
                        ],
                        [
                          {
                            text: '✔️ Siparişimi Tamamla ✔️',
                            callback_data: CallBackQueryResult.CompleteOrder,
                          },
                        ],
                        [
                          {
                            text: '◀️ Ana Menüye Dön ◀️',
                            callback_data: CallBackQueryResult.MainMenu,
                          },
                        ],
                      ],
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
        const customer = await this.customerRepository.getCustomerByTelegramId(
          ctx,
        );
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
                  thumb_url: product.thumbUrl
                    ? `${process.env.BLOB_URL}${product.thumbUrl}`
                    : undefined,
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
              thumb_url: '',
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

    composer.on('message', async (ctx: BotContext) => {
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
      const order = await this.orderRepository.getOrderInBasketByTelegramId(
        ctx,
      );
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
      const customer = await this.customerRepository.getCustomerByTelegramId(
        ctx,
      );
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

  async AddToBasketAndContinueShopping(ctx: BotContext) {
    await this.AddNewOrder(ctx);
    await this.startOrderingCb.StartOrdering(ctx);
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
      const selectedProduct = ctx.message.text;

      const customer = await this.customerRepository.getCustomerByTelegramId(
        ctx,
      );
      const order = await this.orderRepository.getOrderInBasketByTelegramId(
        ctx,
        {orderItems: true},
      );
      if (order) {
        // let selectedProducts: string[] = user.SelectedProducts ? JSON.parse(user.SelectedProducts) : [];
        // let selectedProducts: string[] = [selectedProduct];
        // selectedProducts.push(ctx.message.text);
        // order.SelectedProducts = JSON.stringify(selectedProducts);
        await this.orderItemRepository.orm.delete({
          orderId: order.id,
          productStatus: ProductStatus.Selected,
        });
        order.orderItems = order.orderItems.filter(
          oi => oi.productStatus !== ProductStatus.Selected,
        );
        order.orderItems.push({
          productId: Number.parseInt(selectedProduct),
          amount: 1,
          orderId: order.id,
        });
        await this.orderRepository.orm.save(order);
      } else {
        // let telegramUser = await this.telegramUserRepository.getTelegramUserTelegramId(
        //   ctx,
        // );
        // if (!telegramUser) {
        //   telegramUser = {
        //     Username: ctx.from.username,
        //     FirstName: ctx.from.first_name,
        //     LastName: ctx.from.last_name,
        //     TelegramId: ctx.from.id,
        //   };
        // }
        await this.orderRepository.orm.save({
          customerId: customer.id,
          merchantId: customer.merchantId,
          orderNo: new Date().getTime().toString(36),
          createDate: new Date(),
          orderChannel: OrderChannel.Telegram,
          orderStatus: OrderStatus.New,
          paymentMethod: PaymentMethod.OnDelivery,
          orderItems: [
            <OrderItem>{
              amount: 1,
              productId: Number.parseInt(selectedProduct),
              productStatus: ProductStatus.Selected,
            },
          ],
          // TelegramOrder: telegramUser,
        });

        // ({OrderNo:uuid(), OrderChannel: OrderChannel.Telegram,CreateDate: new Date(),OrderStatus: OrderStatus.InBasket,
        // orderItems:[{Amount: 1, productId: selectedProduct}]  });

        // this.orderDetailsRepository.insert({Amount: 1, productId: selectedProduct, OrderId: newOrder.Id});
      }

      // Get Prodcut Details From DB and Show Them
      const product = await this.productRepository.orm.findOne({
        where: {
          id: Number.parseInt(selectedProduct),
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
            inline_keyboard: [
              [
                {
                  text: '🛒 Sepete Ekle ve Alışverişe devam et 🛒',
                  callback_data:
                    CallBackQueryResult.AddToBasketAndContinueShopping,
                },
              ],
              // [
              //   {
              //     text: '🛒 Sepete Ekle ve Siparişimi Tamamla ✔️',
              //     callback_data: CallBackQueryResult.AddProductAndCompleteOrder,
              //   },
              // ],
              [
                {
                  text: '🍛 Başka bir ürün seç 🍝',
                  callback_data: CallBackQueryResult.StartOrdering,
                },
              ],
              [
                {
                  text: '✔️ Siparişimi Tamamla ✔️',
                  callback_data: CallBackQueryResult.CompleteOrder,
                },
              ],
              [
                {
                  text: '◀️ Ana Menüye Dön ◀️',
                  callback_data: CallBackQueryResult.MainMenu,
                },
              ],
            ],
          },
        },
      );
    }
  }

  // async AddProductAndCompleteOrder(ctx: BotContext) {
  //   await this.AddNewOrder(ctx);
  //   await CompleteOrderHandler.CompleteOrder(ctx);
  // }

  async AddNewOrder(ctx: BotContext) {
    const order = await this.orderRepository.getOrderInBasketByTelegramId(ctx, {
      orderItems: {product: true},
    });
    if (order) {
      const selectedProduct = order.orderItems.find(
        fi => fi.productStatus === ProductStatus.Selected,
      );
      if (selectedProduct) {
        const totalPrice = order.orderItems
          .map(product => product.product)
          ?.map(mp => mp.unitPrice)
          .reduce((prev, current) => prev + current);
        order.totalPrice = order.totalPrice + totalPrice;

        const productExists = order.orderItems.find(
          fi =>
            fi.productId === selectedProduct.productId &&
            fi.productStatus !== ProductStatus.Selected,
        );
        if (productExists) {
          await this.orderItemRepository.orm.delete({id: selectedProduct.id});
          order.orderItems = order.orderItems.filter(
            fi => fi.id !== selectedProduct.id,
          );
          productExists.amount += 1;
        }
        selectedProduct.productStatus = ProductStatus.InBasket;
        await this.orderRepository.orm.save(order);
      }
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
