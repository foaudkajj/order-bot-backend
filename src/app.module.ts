import {Module} from '@nestjs/common';
import {APP_GUARD, APP_INTERCEPTOR} from '@nestjs/core';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {AddressWizardService} from './bot/wiards/address-wizard.service';
import {AddnoteToOrderWizardService} from './bot/wiards/order-note.-wizard.service';
import {PermissionsGuard} from './panel/passport/guards/permissions.guard';
import {PanelModule} from './panel/panel.module';
import {JwtAuthGuard} from './panel/passport/guards/jwt-auth.guard';
import {ConfigModule} from '@nestjs/config';
import {TypeOrmModule} from '@nestjs/typeorm';
import {SharedModule} from './shared.module';
import {PhoneNumberService} from './bot/wiards/phone-number-wizard.service';
import {MerchantInterceptor} from './panel/interceptors/merchant.interceptor';
import * as fs from 'fs';
import {CustomNamingStrategy} from './naming-strategy';
import {CompleteOrderHandler} from './bot/helpers/complete-order-handler';
import {ConfirmOrderHandler} from './bot/helpers/confirm-order.handler';
import {GetConfirmedOrderCb} from './bot/helpers/get-confirmed-orders-handler';
import {OrdersInBasketCb} from './bot/helpers/get-orders-in-basket-cb-handler';
import {InformationMessages} from './bot/helpers/informtaion-msgs';
import {StartOrderingCb} from './bot/helpers/start-ordering-cb-handler';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number.parseInt(process.env.DB_PORT) || 3306,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      synchronize: false,
      logging: false,
      extra: {
        decimalNumbers: true,
      },
      namingStrategy: new CustomNamingStrategy(),
      autoLoadEntities: true,
      keepConnectionAlive: true,
      migrationsRun: true,
    }),
    PanelModule,
    SharedModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: MerchantInterceptor,
    },
    AppService,
    AddressWizardService,
    AddnoteToOrderWizardService,
    PhoneNumberService,
    CompleteOrderHandler,
    ConfirmOrderHandler,
    GetConfirmedOrderCb,
    StartOrderingCb,
    OrdersInBasketCb,
    InformationMessages,
  ],
})
export class AppModule {}
