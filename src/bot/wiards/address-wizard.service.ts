import { Injectable, OnModuleInit } from '@nestjs/common';
import { ExtendedTelegrafContext } from 'src/app.service';
import { OrderStatus } from 'src/DB/enums/OrderStatus';
import { Order } from 'src/DB/models/Order';
import { TelegramUser } from 'src/DB/models/TelegramUser';
import { TelegrafContext } from 'telegraf/typings/context';
import { getRepository, Repository } from 'typeorm';
import { CallBackQueryResult } from '../models/CallBackQueryResult';
const WizardScene = require('telegraf/scenes/wizard')

@Injectable()
export class AddressWizardService {
    userRepository: Repository<TelegramUser> = getRepository(TelegramUser);
    constructor() {

    }
    InitilizeAdressWizard() {
        const address = new WizardScene('address',
            function (ctx: ExtendedTelegrafContext) {
                ctx.reply('Lütfen Açık Adresinizi Giriniz. \n Tekrar Ana Menüye dönmek için bu komutu çalıştırınız /iptal');
                ctx.wizard.next();
            },
            async function (ctx: ExtendedTelegrafContext) {
                if (ctx.updateType == 'callback_query') {
                    ctx.answerCbQuery();
                }

                if (!ctx.message?.text) {
                    ctx.wizard.back();
                } else {
                    if (ctx.message.text.length < 15) {
                        ctx.reply("Lütfen doğru bir adres giriniz.")
                        ctx.wizard.back();
                    }
                    else {
                        // save acik address to database
                        ctx.session.address = ctx.message.text;
                        ctx.wizard.next();
                    }
                }

                ctx.wizard.steps[ctx.wizard.cursor](ctx);
            },
            function (ctx: ExtendedTelegrafContext) {
                ctx.reply('Lütfen konumunuzu gönderiniz. Göndermek istemiyorsanız, <b>istemiyorum</b> yazınız. \n Tekrar Ana Menüye dönmek için bu komutu çalıştırınız /iptal',
                    {
                        parse_mode: 'HTML'
                    });
                ctx.wizard.next();
            },
            async (ctx: ExtendedTelegrafContext) => {
                if (ctx.message.text?.toLowerCase() == 'istemiyorum') {
                    ctx.session.isLocation = false;
                    await this.SaveAddressToDBAndLeaveWizard(ctx);
                    // ctx.wizard.next();
                }
                else {

                    if (ctx.message.location) {
                        ctx.session.isLocation = true;
                        ctx.session.latitude = ctx.message.location.latitude;
                        ctx.session.longitude = ctx.message.location.longitude;
                        ctx.wizard.next();
                    } else {
                        ctx.session.isLocation = false;
                        ctx.wizard.back();
                    }
                    ctx.wizard.steps[ctx.wizard.cursor](ctx);
                }
            },
            // async (ctx: ExtendedTelegrafContext) => {

            // },
            async (ctx: ExtendedTelegrafContext) => {
                try {
                    await this.SaveAddressToDBAndLeaveWizard(ctx);
                    // Sipariş Detayları ile address Gelecek

                } catch (error) {
                    await ctx.reply('Bir hata oluştu. Lütfen tekrar deneyiniz ...');
                    await ctx.scene.leave();
                }
            }
        );
        return address;
    }
    async SaveAddressToDBAndLeaveWizard(ctx: ExtendedTelegrafContext) {
        let user = await this.userRepository.findOne(ctx.from.id);
        if (user) {
            user.Address = ctx.session?.address;
            if (ctx.session.isLocation) {
                user.Location = JSON.stringify({
                    latitude: ctx.session.latitude,
                    longitude: ctx.session.longitude
                });
            }
            await this.userRepository.save(user);
        }

        this.ConfirmOrder(ctx);
        // await ctx.reply('Adresiniz Alınmıştır.',
        //     {
        //         reply_markup: {
        //             one_time_keyboard: true,
        //             inline_keyboard:
        //                 [
        //                     [{ text: "Siparişimi Onayla", callback_data: CallBackQueryResult.SendOrder }],
        //                     [{ text: "Ana Menüye Dön", callback_data: CallBackQueryResult.MainMenu }]
        //                 ]
        //         }
        //     });
        await ctx.scene.leave();
    }

    // Aşağıdaki kod redundant
    orderRepository: Repository<Order> = getRepository(Order);
    async ConfirmOrder(ctx: ExtendedTelegrafContext) {
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

    async GetOrdersInBasket(ctx: TelegrafContext) {
        const ordersInBasket = await this.orderRepository.find({ where: { userId: ctx.from.id, Status: OrderStatus.Given }, relations: ['Product'] });
        let orderDetails = '';
        if (ordersInBasket.length > 0) {
            let TotalAmount = ordersInBasket.map(value => value.Product.UnitPrice * (value.Amount > 0 ? value.Amount : 1)).reduce((previous, current) => previous + current);
            ordersInBasket.forEach(order => {
                orderDetails = orderDetails.concat(`Ürün İsmi : ${order.Product.Title}\n`, `Fiyat : ${order.Product.UnitPrice}TL \n`, `Miktar : ${order.Amount}\n`, `Açıklama : ${order.Description ?? "Yok"}` + '\n\n');
            });
            orderDetails = orderDetails.concat(`\n\n Toplam: ${TotalAmount} TL`);
        }

        return orderDetails;
    }

}