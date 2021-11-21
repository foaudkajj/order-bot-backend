import { Injectable, OnModuleInit } from '@nestjs/common';
import { Context, Scenes, session, Telegraf } from 'telegraf';
// import { TelegrafContext } from 'telegraf/typings/context';
import {
  InlineQueryResultArticle
} from 'telegraf/typings/telegram-types';
import { getCustomRepository, getRepository, Like, Repository } from 'typeorm';
import { BotContext } from './bot/interfaces/BotContext';
import { CallBackQueryResult } from './bot/models/CallBackQueryResult';
import { AddressWizardService } from './bot/wiards/address-wizard.service';
import { OrderStatus, ProductStatus } from './DB/enums/OrderStatus';
import { Product } from './DB/models/Product';
import { AddnoteToOrderWizardService } from './bot/wiards/order-note.-wizard.service';
import { CustomerRepository } from './bot/custom-repositories/CustomerRepository';
import { StartOrderingCb } from './bot/helpers/start-ordering-CB-handler';
import { OrdersInBasketCb } from './bot/helpers/get-orders-in-basket-CB-handler';
import { FirstMessageHandler } from './bot/helpers/first-message-handler';
import { CompleteOrderHandler } from './bot/helpers/complete-order-handler';
import { OrderRepository } from './bot/custom-repositories/OrderRepository';
import { ConfirmOrderHandler } from './bot/helpers/confirm-order.handler';
import { OrderItem } from './DB/models/OrderItem';
import { GetConfirmedOrderCb } from './bot/helpers/get-confirmed-orders-handler';
import { Category } from './DB/models/Category';
import { OrderChannel } from './DB/enums/OrderChannel';
import { v4 as uuid } from 'uuid';

@Injectable()
export class AppService implements OnModuleInit {
  customerRepository = getCustomRepository(CustomerRepository);
  orderRepository = getCustomRepository(OrderRepository);
  orderItemRepository: Repository<OrderItem> = getRepository(OrderItem);
  productRepository: Repository<Product> = getRepository(Product);
  categoryRepository: Repository<Category> = getRepository(Category);
  constructor (
    private addressWizard: AddressWizardService,
    private addNoteToOrderWizard: AddnoteToOrderWizardService
  ) {}

  onModuleInit () {
    this.InitlizeAndLunchBot();
  }

  getHello (): string {
    return 'Hello Fuat!';
  }

  static bot: Telegraf<BotContext>;
  InitlizeAndLunchBot () {
    AppService.bot = new Telegraf<BotContext>(
      '1485687554:AAFbN5pD2h5hzi9o9eydQjh6l4RcVYTtp5c'
    ); //, { handlerTimeout: 1000 }

    this.InitlizeWizards(AppService.bot);
    this.InilizeBotEventsHandlers(AppService.bot);

    AppService.bot.launch();
  }

  InilizeBotEventsHandlers (bot: Telegraf<BotContext>) {
    bot.command(
      'start',
      async ctx => await FirstMessageHandler.startOptions(ctx)
    );

    bot.on('callback_query', async ctx => {
      try {
        if ('data' in ctx.callbackQuery && ctx.callbackQuery.data) {
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
              const orderDetails = await OrdersInBasketCb.GetOrdersInBasketByStatus(
                ctx,
                OrderStatus.New
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
                          callback_data: CallBackQueryResult.StartOrdering
                        }
                      ],
                      [
                        {
                          text: '🚚 Siparişini Takip Et 🚚',
                          callback_data: CallBackQueryResult.GetConfirmedOrders
                        }
                      ],
                      // [{ text: "🗑 Sepetem 🗑", callback_data: CallBackQueryResult.MyBasket }],
                      [
                        {
                          text: '🗑 Sepetemi Boşalt 🗑',
                          callback_data: CallBackQueryResult.EmptyBakset
                        }
                      ],
                      [
                        {
                          text: '✔️ Siparişimi Tamamla ✔️',
                          callback_data: CallBackQueryResult.CompleteOrder
                        }
                      ],
                      [
                        {
                          text: '◀️ Ana Menüye Dön ◀️',
                          callback_data: CallBackQueryResult.MainMenu
                        }
                      ]
                    ]
                  }
                });
              }
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
              await ctx.answerCbQuery('Bu Özellik Yapım Aşamasındadır');
              break;

            case CallBackQueryResult.AddNoteToOrder:
              await this.addNoteToOrder(ctx);
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
      } catch (e) {
        console.log(e);
        await ctx.answerCbQuery();
      }
      // if ("data" in ctx.callbackQuery && ctx.callbackQuery.data) {
      //   console.log(ctx.callbackQuery.from.id)
      // }
    });

    bot.on('inline_query', async ctx => {
      try {
        const customer = await this.customerRepository.getCustomerByTelegramId(
          ctx
        );
        if (customer) {
          const category = await this.categoryRepository.findOne({
            where: { CategoryKey: Like(ctx.inlineQuery.query) },
            relations: ['Products']
          });
          await ctx.answerInlineQuery(
            category?.Products?.map(
              product =>
                <InlineQueryResultArticle>{
                  id: product.Id.toString(),
                  type: product.Type,
                  photo_url: product.ThumbUrl,
                  thumb_url: product.ThumbUrl,
                  title: product.Title,
                  description: product.Description,
                  // caption: product.Caption,
                  input_message_content: {
                    message_text: product.Id.toString()
                    //       // message_text:
                    //       //   `<b>🎞️ TesTRTt</b>\n` +
                    //       //   `http://www.youtube.com/watch?v=${'L_Gqpg0q1sfdxs' || ''}`,
                    // parse_mode: 'HTML',
                  }
                }
            ),
            { cache_time: 0 }
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
                message_text: 'Bir Hata Oluştu Lütfen Tekrar Deneyiniz /start'
                //       // message_text:
                //       //   `<b>🎞️ TesTRTt</b>\n` +
                //       //   `http://www.youtube.com/watch?v=${'L_Gqpg0q1sfdxs' || ''}`,
                // parse_mode: 'HTML',
              }
            }
          ],
          { cache_time: 0 }
        );
      }
    });

    bot.on('message', async (ctx: BotContext) => {
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

  async EmptyBasket (ctx: BotContext) {
    try {
      const order = await this.orderRepository.getOrderInBasketByTelegramId(
        ctx
      );
      if (order) {
        await this.orderItemRepository.delete({ OrderId: order.Id });
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

  async SendOrder (ctx: BotContext) {
    try {
      // const userInfo = ctx.from.is_bot ? ctx.callbackQuery.from : ctx.from;
      const customer = await this.customerRepository.getCustomerByTelegramId(
        ctx
      );
      await this.orderRepository.update(
        { customerId: customer.Id, OrderStatus: OrderStatus.New },
        { OrderStatus: OrderStatus.UserConfirmed }
      );
      await ctx.answerCbQuery('Siparişiniz Gönderilmiştir');
      await FirstMessageHandler.startOptions(ctx);
    } catch (error) {
      console.log(error);
      await ctx.answerCbQuery('Bir hata oluştu. Lütfen tekrar deneyiniz.');
    }
  }

  async EnterAddress (ctx: BotContext) {
    await ctx.scene.enter(
      'address',
      await ctx.reply(
        'Lütfen Açık Adresinizi Giriniz. \n Tekrar Ana Menüye dönmek için bu komutu çalıştırınız /iptal'
      )
    );
  }

  async AddToBasket (ctx: BotContext) {
    await this.AddNewOrder(ctx);
    await StartOrderingCb.StartOrdering(ctx);
  }

  InitlizeWizards (bot: Telegraf<Context>) {
    const addNoteToOrderWizard = this.addNoteToOrderWizard.InitilizeAddnoteToOrderWizard();
    const addressWizard = this.addressWizard.InitilizeAdressWizard();
    const stage = new Scenes.Stage<BotContext>([
      addressWizard,
      addNoteToOrderWizard
    ]);
    stage.command('iptal', async ctx => {
      await ctx.scene.leave();
      await FirstMessageHandler.startOptions(ctx);
    });
    bot.use(session());
    bot.use(stage.middleware());
  }

  async AddToBasketAndComplteOrderOrContinueShopping (ctx: BotContext) {
    if ('text' in ctx.message) {
      const selectedProduct = ctx.message.text;

      const customer = await this.customerRepository.getCustomerByTelegramId(
        ctx
      );
      const order = await this.orderRepository.getOrderInBasketByTelegramId(
        ctx,
        ['orderItems']
      );
      if (order) {
        // let selectedProducts: string[] = user.SelectedProducts ? JSON.parse(user.SelectedProducts) : [];
        // let selectedProducts: string[] = [selectedProduct];
        // selectedProducts.push(ctx.message.text);
        // order.SelectedProducts = JSON.stringify(selectedProducts);
        await this.orderItemRepository.delete({
          OrderId: order.Id,
          ProductStatus: ProductStatus.Selected
        });
        order.orderItems = order.orderItems.filter(
          oi => oi.ProductStatus !== ProductStatus.Selected
        );
        order.orderItems.push({
          productId: Number.parseInt(selectedProduct),
          Amount: 1,
          OrderId: order.Id
        });
        await this.orderRepository.save(order);
      } else {
        await this.orderRepository.save({
          customerId: customer.Id,
          OrderNo: uuid(),
          CreateDate: new Date(),
          OrderChannel: OrderChannel.Telegram,
          OrderStatus: OrderStatus.New,
          orderItems: [
            {
              Amount: 1,
              productId: Number.parseInt(selectedProduct),
              ProductStatus: ProductStatus.Selected
            }
          ],
          TelegramOrder: {
            Username: ctx.from.username,
            FirstName: ctx.from.first_name,
            LastName: ctx.from.last_name,
            TelegramId: ctx.from.id
          }
        });

        // ({OrderNo:uuid(), OrderChannel: OrderChannel.Telegram,CreateDate: new Date(),OrderStatus: OrderStatus.InBasket,
        // orderItems:[{Amount: 1, productId: selectedProduct}]  });

        // this.orderDetailsRepository.insert({Amount: 1, productId: selectedProduct, OrderId: newOrder.Id});
      }

      // Get Prodcut Details From DB and Show Them
      const product = await this.productRepository.findOne({
        where: { Id: selectedProduct }
      });
      await ctx.reply(
        `<b>${product.Title}</b> \n` +
          `Açıklama:<i> ${product.Description}</i> \n` +
          `Fiyat: <u> ${product.UnitPrice} TL</u>`,
        {
          parse_mode: 'HTML',
          reply_markup: {
            one_time_keyboard: true,
            inline_keyboard: [
              [
                {
                  text: '🛒 Sepete Ekle ve Alışverişe devam et 🛒',
                  callback_data: CallBackQueryResult.AddToBasket
                }
              ],
              [
                {
                  text: '🛒 Sepete Ekle ve Siparişimi Tamamla ✔️',
                  callback_data: CallBackQueryResult.AddProductAndCompleteOrder
                }
              ],
              [
                {
                  text: '🍛 Başka Ürün Seç 🍝',
                  callback_data: CallBackQueryResult.StartOrdering
                }
              ],
              [
                {
                  text: '✔️ Siparişimi Tamamla ✔️',
                  callback_data: CallBackQueryResult.CompleteOrder
                }
              ],
              [
                {
                  text: '◀️ Ana Menüye Dön ◀️',
                  callback_data: CallBackQueryResult.MainMenu
                }
              ]
            ]
          }
        }
      );
    }
  }

  async AddProductAndCompleteOrder (ctx: BotContext) {
    await this.AddNewOrder(ctx);
    await CompleteOrderHandler.CompleteOrder(ctx);
  }

  async AddNewOrder (ctx: BotContext) {
    const order = await this.orderRepository.getOrderInBasketByTelegramId(ctx, [
      'orderItems',
      'orderItems.Product'
    ]);
    if (order) {
      console.log('AddNEwOrder');
      const selectedProduct = order.orderItems.find(
        fi => fi.ProductStatus === ProductStatus.Selected
      );
      if (selectedProduct) {
        const totalPrice = order.orderItems
          .map(product => product.Product)
          ?.map(mp => mp.UnitPrice)
          .reduce((prev, current) => prev + current);
        order.TotalPrice = +order.TotalPrice + +totalPrice;

        const productExists = order.orderItems.find(
          fi =>
            fi.productId == selectedProduct.productId &&
            fi.ProductStatus !== ProductStatus.Selected
        );
        if (productExists) {
          await this.orderItemRepository.delete({ Id: selectedProduct.Id });
          order.orderItems = order.orderItems.filter(
            fi => fi.Id !== selectedProduct.Id
          );
          productExists.Amount += 1;
        }
        selectedProduct.ProductStatus = ProductStatus.InBasket;
        await this.orderRepository.save(order);
      }
    }
  }

  async addNoteToOrder (ctx: BotContext) {
    const order = await this.orderRepository.getOrdersInBasketByStatus(
      ctx,
      OrderStatus.New
    );
    if (order) {
      ctx.scene.enter(
        'AddNoteToOrder',
        ctx.reply(
          'Lütfen Eklemek İstediğiniz notu giriniz... \n Tekrar Ana Menüye dönmek için bu komutu çalıştırınız /iptal'
        )
      );
    } else {
      await ctx.answerCbQuery('Sepetiniz Boştur.');
    }
  }
}
