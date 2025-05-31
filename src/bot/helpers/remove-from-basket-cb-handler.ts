import {Injectable} from '@nestjs/common';
import {CallBackQueryResult, Messages} from '../models/enums';
import {BotCommands} from '../bot-commands';
import {BotContext} from '../interfaces';
import {DataSource} from 'typeorm';
import {OrderRepository} from 'src/db/repositories';
import {FirstMessageHandler} from './first-message-handler';
import {Order, OrderItem} from 'src/models';

@Injectable()
export class RemoveFromBasketCb {
  constructor(
    private dataSource: DataSource,
    private orderRepository: OrderRepository,
    private fmh: FirstMessageHandler,
  ) {}

  async removeFromBasket(ctx: BotContext, productIdToRemove: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const order = await this.orderRepository.getCurrentOrder(ctx, {
        orderItems: {product: true},
      });

      const selectedProducts = order?.orderItems?.map(oi => oi.product) ?? [];

      if (selectedProducts.length === 0) {
        await Promise.all([
          ctx.answerCbQuery(Messages.EMPTY_BASKET),
          this.fmh.startOptions(ctx),
        ]);
      }

      if (productIdToRemove) {
        const remainingProducts = selectedProducts.filter(
          p => p.id !== productIdToRemove,
        );

        order.totalPrice = remainingProducts.reduce(
          (sum, p) => sum + p.unitPrice,
          0,
        );

        await Promise.all([
          queryRunner.manager.delete(OrderItem, {
            productId: productIdToRemove,
            orderId: order.id,
          }),
          queryRunner.manager.update(
            Order,
            {id: order.id},
            {totalPrice: order.totalPrice},
          ),
        ]);

        if (remainingProducts.length > 0) {
          await ctx.editMessageText(
            `Ürün çıkarılmıştır.\n Lütfen çıkarmak istediğiniz başka bir ürün seçiniz:`,
            {
              reply_markup: {
                inline_keyboard: [
                  ...remainingProducts
                    .map(p => {
                      return BotCommands.getCustom([
                        {
                          text: p.title,
                          action: CallBackQueryResult.RemoveFromBasket,
                          data: {
                            productId: p.id,
                          },
                        },
                      ]);
                    })
                    .flat(),
                  ...BotCommands.getCustom([
                    {action: CallBackQueryResult.MainMenu},
                  ]),
                ],
              },
            },
          );
        } else {
          await Promise.all([
            ctx.answerCbQuery(Messages.EMPTY_BASKET),
            this.fmh.startOptions(ctx),
          ]);
        }
      } else {
        await ctx.editMessageText(
          'Lütfen çıkarmak istediğiniz ürünü seçiniz:',
          {
            reply_markup: {
              inline_keyboard: [
                ...selectedProducts
                  .map(p => {
                    return BotCommands.getCustom([
                      {
                        text: p.title,
                        action: CallBackQueryResult.RemoveFromBasket,
                        data: {
                          productId: p.id,
                        },
                      },
                    ]);
                  })
                  .flat(),
                ...BotCommands.getCustom([
                  {action: CallBackQueryResult.MainMenu},
                ]),
              ],
            },
          },
        );
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
