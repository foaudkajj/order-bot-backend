import { Injectable, OnModuleInit } from '@nestjs/common';
import { ExtendedTelegrafContext } from 'src/app.service';
import { TelegrafContext } from 'telegraf/typings/context';
import { CallBackQueryResult } from '../models/CallBackQueryResult';
const WizardScene = require('telegraf/scenes/wizard')

@Injectable()
export class AddressWizardService {
    constructor() {

    }
    InitilizeAdressWizard() {
        const address = new WizardScene('address',
            function (ctx: ExtendedTelegrafContext) {
                ctx.reply('Lütfen Açık Adresinizi veya Konumunuzu Gönderiniz. \n Tekrar Ana Menüye dönmek için bu komutu çalıştırınız /iptal');
                ctx.wizard.next();
            },
            async function (ctx: ExtendedTelegrafContext) {
                ctx.session.isLocation = false;

                if (ctx.message.location?.latitude) {
                    // save location to database
                    ctx.session.isLocation = true;
                    ctx.session.address = ctx.message.text;
                    ctx.wizard.next();
                }
                else if (ctx.message.text.length < 15) {
                    ctx.wizard.back();
                }
                else {
                    // save acik address to database
                    ctx.session.address = ctx.message.text;
                    ctx.wizard.next();
                }
                ctx.wizard.steps[ctx.wizard.cursor](ctx);
            },
            async (ctx: ExtendedTelegrafContext) => {
                try {
                    console.log(ctx.from.id)
                    // Sipariş Detayları ile address Gelecek
                    await ctx.reply('Adresiniz Alınmıştır.',
                        {
                            reply_markup: {
                                one_time_keyboard: true,
                                inline_keyboard:
                                    [
                                        [{ text: "Siparişimi Onayla", callback_data: CallBackQueryResult.CompleteOrder }],
                                        [{ text: "Ana Menüye Dön", callback_data: CallBackQueryResult.MakeOrder }]
                                    ]
                            }
                        });
                    await ctx.scene.leave();

                } catch (error) {
                    await ctx.reply('Bir hata oluştu. Lütfen tekrar deneyiniz ...');
                    await ctx.scene.leave();
                }
            }
        );
        return address;
    }

}