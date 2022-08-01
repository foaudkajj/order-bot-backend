import {Module} from '@nestjs/common';
import {SharedModule} from 'src/shared.module';
import {BotService} from './bot.service';
import {
  FirstMessageHandler,
  CompleteOrderHandler,
  ConfirmOrderHandler,
  GetConfirmedOrderCb,
  OrdersInBasketCb,
  StartOrderingCb,
  InformationMessages,
} from './helpers';
import {
  AddressWizardService,
  AddnoteToOrderWizardService,
  PhoneNumberWizardService,
} from './wiards';

@Module({
  imports: [SharedModule],
  controllers: [],
  providers: [
    BotService,
    AddressWizardService,
    AddnoteToOrderWizardService,
    PhoneNumberWizardService,
    FirstMessageHandler,
    CompleteOrderHandler,
    ConfirmOrderHandler,
    GetConfirmedOrderCb,
    OrdersInBasketCb,
    StartOrderingCb,
    InformationMessages,
  ],
  exports: [
    AddressWizardService,
    AddnoteToOrderWizardService,
    PhoneNumberWizardService,
    FirstMessageHandler,
    CompleteOrderHandler,
    ConfirmOrderHandler,
    GetConfirmedOrderCb,
    OrdersInBasketCb,
    StartOrderingCb,
    InformationMessages,
  ],
})
export class BotModule {}
