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

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'password',
      database: 'orderbot',
      synchronize: true,
      logging: false,
      entities: ['dist/**/*.js'],
      extra: {
        decimalNumbers: true,
      },
      namingStrategy: new CustomNamingStrategy(),
      autoLoadEntities: true,
      keepConnectionAlive: true,
    }),
    ConfigModule.forRoot({isGlobal: true}),
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
  ],
})
export class AppModule {}
