import {Injectable} from '@nestjs/common';
import {Scenes} from 'telegraf';
import {BotContext} from '../interfaces/bot-context';
import {CallBackQueryResult} from '../models/enums';
import {BotCommands} from '../bot-commands';
import {turkishToEnglish} from 'src/shared/utils';
import {AddressHandler, FirstMessageHandler} from '../helpers';
import {OrderRepository} from 'src/db/repositories';

@Injectable()
export class AddressWizardService {
  constructor(
    private addressHanlder: AddressHandler,
    private orderRepository: OrderRepository,
    private fmh: FirstMessageHandler,
  ) {}

  initilizeAdressWizard() {
    const address = new Scenes.WizardScene(
      'address',
      async (ctx: BotContext) => {
        if (ctx.updateType === 'callback_query') ctx.answerCbQuery();

        if (ctx.message && 'text' in ctx.message) {
          await ctx.reply(
            'Lütfen konumunuzu gönderiniz. Göndermek istemiyorsanız, <b>istemiyorum</b> yazınız. \n Tekrar Ana Menüye dönmek için iptale /iptal tıklayınız',
            {
              parse_mode: 'HTML',
            },
          );
          ctx.scene.session.address = ctx.message.text;
          return ctx.wizard.next();
        } else {
          await ctx.reply(
            'Lütfen Açık Adresinizi Giriniz. \n Tekrar Ana Menüye dönmek için iptale /iptal tıklayınız',
          );
        }
      },
      async (ctx: BotContext) => {
        const order = await this.orderRepository.getCurrentOrder(ctx, {
          orderItems: {product: true},
          customer: true,
        });

        if (
          ctx?.message &&
          'text' in ctx.message &&
          turkishToEnglish(ctx.message.text ?? '')
            .trim()
            .toLowerCase()
            ?.toLowerCase() === 'istemiyorum'
        ) {
          ctx.scene.session.isLocation = false;
          await this.addressHanlder.saveAddressToDB(ctx);
          await ctx.scene.leave();
          if (!order || order?.orderItems?.length === 0) {
            await this.fmh.startOptions(ctx);
          } else {
            await this.askIfUserWantsToAddNote(ctx);
          }
        } else {
          if (
            ctx?.message &&
            'location' in ctx.message &&
            ctx.message.location
          ) {
            ctx.scene.session.isLocation = true;
            ctx.scene.session.latitude = ctx.message.location.latitude;
            ctx.scene.session.longitude = ctx.message.location.longitude;
            await this.addressHanlder.saveAddressToDB(ctx);
            await ctx.scene.leave();
            if (!order || order?.orderItems?.length === 0) {
              await this.fmh.startOptions(ctx);
            } else {
              await this.askIfUserWantsToAddNote(ctx);
            }
          } else {
            ctx.scene.session.isLocation = false;
            if (ctx.updateType === 'callback_query') ctx.answerCbQuery();
            await ctx.reply(
              'Lütfen konumunuzu gönderiniz. Göndermek istemiyorsanız, <b>istemiyorum</b> yazınız. \n Tekrar Ana Menüye dönmek için iptale /iptal tıklayınız',
              {
                parse_mode: 'HTML',
              },
            );
          }
        }
      },
    );
    return address;
  }

  async askIfUserWantsToAddNote(ctx: BotContext) {
    await ctx.replyWithMarkdownV2(
      '<b>Siparişinize bir not eklemek ister misiniz?</b> \n \n',
      {
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: BotCommands.getCustom([
            {text: 'Evet', action: CallBackQueryResult.AddNoteToOrder},
            {text: 'Hayır', action: CallBackQueryResult.ConfirmOrder},
          ]),
        },
      },
    );
  }
}
