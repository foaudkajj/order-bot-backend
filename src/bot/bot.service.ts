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
  RemoveFromBasketCb,
  StartOrderingCb,
} from './helpers';
import {CallBackQueryResult, Messages} from './models/enums';
import {
  AddnoteToOrderWizardService,
  AddressWizardService,
  PhoneNumberWizardService,
} from './wizards';
import {safeJsonParse, turkishToEnglish} from 'src/shared/utils';
import {CallbackQueryData} from './interfaces/callback-query-data';
import {BotContext} from './interfaces';
import {InlineQueryResultArticle} from '@telegraf/types';
import {Composer, Scenes, Telegraf, session} from 'telegraf';
import {Like} from 'typeorm/find-options/operator/Like';
import {BotCommands} from './bot-commands';
import {DataSource, In} from 'typeorm';
import {WinstonLoggerService} from 'src/logger';

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
    private removeFromBasketCb: RemoveFromBasketCb,
    private dataSource: DataSource,
    private loggerService: WinstonLoggerService,
  ) {}

  static botMap = new Map<string, Telegraf<BotContext>>();

  onModuleInit() {
    this.initlizeAndLunchBot();
  }

  composer = new Composer<BotContext>();

  async initlizeAndLunchBot() {
    const merchantList = await this.merchantRepository.orm.find({
      where: {isActive: true},
    });

    this.initlizeWizards(this.composer);
    this.inilizeBotEventsHandlers(this.composer);

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
        console.log(
          `Bot with username: ${merchant.botUserName} is starting...`,
        );
        const bot = new Telegraf<BotContext>(merchant.botToken);

        bot.catch((err, ctx) => {
          this.loggerService.error(
            'Error catched by bot catcher: ',
            JSON.stringify(err),
          );
        });

        bot.use(this.composer);
        bot.launch(() => {
          this.loggerService.log(
            `Bot started. Merchant: ${merchant.botUserName}`,
          );
          BotService.botMap.set(bot.botInfo.username, bot);
        });
        process.once('SIGINT', () => {
          bot.stop('SIGINT');
          this.loggerService.log(
            `Bot stopped. Merchant: ${merchant.botUserName}`,
          );
        });
        process.once('SIGTERM', () => {
          bot.stop('SIGTERM');
          this.loggerService.log(
            `Bot stopped. Merchant: ${merchant.botUserName}`,
          );
        });
      }
    }
  }

  inilizeBotEventsHandlers(composer: Composer<BotContext>) {
    // initlize the custom properties.
    composer.use((ctx, next) => {
      ctx.botUser = ctx.from.is_bot ? ctx.callbackQuery.from : ctx.from;
      return next();
    });
    composer.command('start', async ctx => await this.fmh.startOptions(ctx));
    composer.on('callback_query', async ctx => {
      if ('data' in ctx.callbackQuery && ctx.callbackQuery.data) {
        const callbackQueryData = safeJsonParse<CallbackQueryData>(
          ctx.callbackQuery.data,
        );
        try {
          switch (callbackQueryData.action) {
            case CallBackQueryResult.StartOrdering:
              await ctx.answerCbQuery();
              await this.startOrderingCb.startOrdering(ctx);
              break;

            case CallBackQueryResult.CompleteOrder:
              await this.askForPhoneNumberIfNotAvailable(ctx);
              break;
            case CallBackQueryResult.AddToBasketAndContinueShopping:
              await Promise.all([
                ctx.answerCbQuery(),
                this.addProdToBasket(
                  ctx,
                  Number.parseInt(callbackQueryData.data.selectedProductId),
                ),
              ]);

              await this.startOrderingCb.startOrdering(ctx);
              break;
            case CallBackQueryResult.EnterAddress:
              await ctx.answerCbQuery();
              await this.enterAddress(ctx);
              break;
            case CallBackQueryResult.SendOrder:
              await this.sendOrder(ctx);
              break;
            case CallBackQueryResult.MyBasket:
              {
                const order = await this.orderRepository.getCurrentOrder(ctx, {
                  orderItems: {product: true},
                  customer: true,
                });

                if (!order || order?.orderItems?.length === 0) {
                  await ctx.answerCbQuery(
                    'Sepetiniz Boştur. Lütfen Ürün Seçiniz',
                  );
                } else {
                  const [orderDetails, _] = await Promise.all([
                    this.ordersInBasketCb.getOrdersDetails(ctx, [order]),
                    ctx.answerCbQuery(),
                  ]);

                  if (orderDetails != null) {
                    await ctx.editMessageText(orderDetails, {
                      parse_mode: 'HTML',
                      reply_markup: {
                        inline_keyboard: BotCommands.getCustom([
                          {action: CallBackQueryResult.StartOrdering},
                          {action: CallBackQueryResult.TrackOrder},
                          {action: CallBackQueryResult.EmptyBakset},
                          {action: CallBackQueryResult.CompleteOrder},
                          {action: CallBackQueryResult.MainMenu},
                        ]),
                      },
                    });
                  }
                }
              }
              break;
            case CallBackQueryResult.ConfirmOrder:
              await ctx.answerCbQuery();
              await this.confirmOrderHandler.confirmOrder(ctx);
              break;
            case CallBackQueryResult.EmptyBakset:
              await this.emptyBasket(ctx);
              break;
            case CallBackQueryResult.MainMenu:
              await ctx.answerCbQuery();
              await this.fmh.startOptions(ctx);
              break;
            case CallBackQueryResult.AddNoteToOrder:
              await this.addNoteToOrder(ctx);
              break;
            case CallBackQueryResult.TrackOrder:
              await this.getConfirmedOrderCb.getActiveOrders(ctx);
              break;

            case CallBackQueryResult.RemoveFromBasket:
              await this.removeFromBasketCb.removeFromBasket(
                ctx,
                callbackQueryData.data?.productId,
              );
              break;

            default:
              await ctx.answerCbQuery();
              break;
          }
        } catch (e) {
          this.loggerService.error(
            `callbackQueryData: ${JSON.stringify(callbackQueryData)}`,
            e,
          );
          await ctx.answerCbQuery();
        }
      }
    });

    composer.on('inline_query', async ctx => {
      try {
        const customer = await this.customerRepository.getCurrentCustomer(ctx);
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
                  title: `${product.title} - ${product.unitPrice} TL`,
                  description: product.description,
                  // caption: product.Caption,
                  input_message_content: {
                    message_text: product.id.toString(),
                  },
                },
            ),
            {cache_time: 0},
          );
        }
      } catch (error) {
        this.loggerService.error(
          `callbackQueryData: ${JSON.stringify(ctx)}`,
          error,
        );
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
        if ('text' in ctx.message) {
          const message = ctx.message.text;

          if (!ctx.message.from.is_bot && parseInt(message, 10)) {
            await this.selectedProductOptions(
              ctx,
              Number.parseInt(ctx.message.text),
            );
          } else if (
            turkishToEnglish(message).toLowerCase().startsWith('kod:')
          ) {
            const productCode = message
              .substring(message.indexOf(':') + 1)
              // replace non numerics
              .replace(/[^\d]+/g, '');

            const product = await this.productRepository.orm.findOneBy({
              code: productCode,
            });

            if (product) {
              await this.selectedProductOptions(ctx, product.id);
            } else {
              await ctx.replyWithHTML(
                '<b>Girdiğiniz koda ait bir ürün bulunamamıştır.</b>',
              );
              await this.fmh.startOptions(ctx);
            }
          }
        }
      } catch (e) {
        this.loggerService.error(
          `callbackQueryData: ${JSON.stringify(ctx)}`,
          e,
        );
      }
    });
  }

  async emptyBasket(ctx: BotContext) {
    const order = await this.orderRepository.getCurrentOrder(ctx);
    if (order) {
      await Promise.all([
        this.orderRepository.orm.delete({id: order.id}),
        ctx.answerCbQuery('Sepetiniz Boşaltılmıştır.'),
      ]);
    } else {
      await ctx.answerCbQuery(Messages.EMPTY_BASKET);
    }
  }

  async sendOrder(ctx: BotContext) {
    // const userInfo = ctx.from.is_bot ? ctx.callbackQuery.from : ctx.from;
    const customer = await this.customerRepository.getCurrentCustomer(ctx);
    const order = await this.orderRepository.getCurrentOrder(ctx, {
      orderItems: true,
    });
    const productIdList = order.orderItems.map(oi => oi.productId);

    const products = await this.productRepository.orm.find({
      where: {id: In(productIdList)},
    });

    for (const oi of order.orderItems) {
      const product = products.find(p => p.id === oi.productId);
      const remainingAmount = product.count - oi.amount;
      if (remainingAmount < 0) {
        await Promise.all([
          ctx.answerCbQuery(
            `Ürün sayısı ${oi.amount} adet, ancak stokta ${product.count} adet var.`,
          ),
          await this.orderItemRepository.orm.delete({
            orderId: order.id,
            productId: oi.productId,
          }),
          this.fmh.startOptions(ctx),
        ]);

        return;
      } else {
        await this.productRepository.orm.update(
          {id: product.id},
          {count: remainingAmount},
        );
      }
    }

    await Promise.all([
      this.orderRepository.orm.update(
        {customerId: customer.id, orderStatus: OrderStatus.New},
        {orderStatus: OrderStatus.UserConfirmed},
      ),
      ctx.answerCbQuery('Siparişiniz Gönderilmiştir'),
      this.fmh.startOptions(ctx),
    ]);
  }

  async enterAddress(ctx: BotContext) {
    await ctx.scene.enter(
      'address',
      // await ctx.reply(
      //   'Lütfen Açık Adresinizi Giriniz. \n Tekrar Ana Menüye dönmek için bu komutu çalıştırınız /iptal',
      // ),
    );
  }

  initlizeWizards(composer: Composer<BotContext>) {
    const addNoteToOrderWizard =
      this.addNoteToOrderWizard.initilizeAddnoteToOrderWizard();
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

  async selectedProductOptions(ctx: BotContext, selectedProductId: number) {
    const customer = await this.customerRepository.getCurrentCustomer(ctx);

    // Get Prodcut Details From DB and Show Them
    const product = await this.productRepository.orm.findOne({
      where: {
        id: selectedProductId,
        merchantId: customer.merchantId,
      },
    });
    if (product) {
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
  async addProdToBasket(ctx: BotContext, selectedProductId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let order = await this.orderRepository.getCurrentOrder(ctx, {
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
        const customer = await this.customerRepository.getCurrentCustomer(ctx);
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
    const order = await this.orderRepository.getCurrentOrder(ctx);
    if (order) {
      ctx.scene.enter(
        'AddNoteToOrder',
        // ctx.reply(
        //   'Lütfen Eklemek İstediğiniz notu giriniz... \n Tekrar Ana Menüye dönmek için bu komutu çalıştırınız /iptal',
        // ),
      );
    } else {
      await ctx.answerCbQuery(Messages.EMPTY_BASKET);
    }
  }

  async askForPhoneNumberIfNotAvailable(ctx: BotContext) {
    const order = await this.orderRepository.getCurrentOrder(ctx, {
      orderItems: true,
    });

    if (!order?.orderItems?.length) {
      await ctx.answerCbQuery(Messages.EMPTY_BASKET);
      return;
    }

    const customer = await this.customerRepository.getCurrentCustomer(ctx);
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
      await this.completeOrderHandler.completeOrder(ctx);
    }
  }
}
