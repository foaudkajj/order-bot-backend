import {HttpModule} from '@nestjs/axios';
import {Module} from '@nestjs/common';
import {AppService} from 'src/app.service';
import {CompleteOrderHandler} from 'src/bot/helpers/complete-order-handler';
import {ConfirmOrderHandler} from 'src/bot/helpers/confirm-order.handler';
import {GetConfirmedOrderCb} from 'src/bot/helpers/get-confirmed-orders-handler';
import {OrdersInBasketCb} from 'src/bot/helpers/get-orders-in-basket-cb-handler';
import {InformationMessages} from 'src/bot/helpers/informtaion-msgs';
import {StartOrderingCb} from 'src/bot/helpers/start-ordering-cb-handler';
import {AddressWizardService} from 'src/bot/wiards/address-wizard.service';
import {AddnoteToOrderWizardService} from 'src/bot/wiards/order-note.-wizard.service';
import {PhoneNumberService} from 'src/bot/wiards/phone-number-wizard.service';
import GetirTokenService from 'src/panel/helpers/getir-token-helper';
import {SharedModule} from 'src/shared.module';
import {GetirService} from '../../entegrations-management/getir/getir.service';
import {OrderController} from './order.controller';
import {OrderService} from './order.service';

@Module({
  imports: [SharedModule, HttpModule],
  controllers: [OrderController],
  providers: [
    OrderService,
    GetirService,
    GetirTokenService,
    InformationMessages,
    AppService,
    AddressWizardService,
    AddnoteToOrderWizardService,
    PhoneNumberService,
    CompleteOrderHandler,
    ConfirmOrderHandler,
    GetConfirmedOrderCb,
    OrdersInBasketCb,
    StartOrderingCb,
  ],
  exports: [],
})
export class OrderModule {}
