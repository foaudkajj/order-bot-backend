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
  RemoveFromBasketCb,
  AddressHandler,
} from './helpers';
import {
  AddressWizardService,
  AddnoteToOrderWizardService,
  PhoneNumberWizardService,
} from './wizards';
import {LoggerModule} from 'src/logger';

@Module({
  imports: [SharedModule, LoggerModule],
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
    RemoveFromBasketCb,
    InformationMessages,
    AddressHandler,
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
    RemoveFromBasketCb,
    InformationMessages,
    AddressHandler,
  ],
})
export class BotModule {}
