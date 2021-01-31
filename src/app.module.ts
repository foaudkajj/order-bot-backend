import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AddressWizardService } from './bot/wiards/address-wizard.service';
import { AddnoteToOrderWizardService } from './bot/wiards/order-note.-wizard.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, AddressWizardService, AddnoteToOrderWizardService],
})
export class AppModule { }
