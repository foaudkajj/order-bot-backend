import {Module} from '@nestjs/common';
import {APP_GUARD} from '@nestjs/core';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {AddressWizardService} from './bot/wiards/address-wizard.service';
import {AddnoteToOrderWizardService} from './bot/wiards/order-note.-wizard.service';
import {PermessionsGuard} from './panel/guards/permessions.guard';
import {PanelModule} from './panel/panel.module';
import {JwtAuthGuard} from './panel/passport/guards/jwt-auth.guard';
import {ConfigModule} from '@nestjs/config';
import {TypeOrmModule} from '@nestjs/typeorm';
import {getConnectionOptions} from 'typeorm';
import {SharedModule} from './shared.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    PanelModule,
    TypeOrmModule.forRootAsync({
      useFactory: async () =>
        Object.assign(await getConnectionOptions(), {
          autoLoadEntities: true,
          keepConnectionAlive: true,
        }),
    }),
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
      useClass: PermessionsGuard,
    },
    AppService,
    AddressWizardService,
    AddnoteToOrderWizardService,
  ],
})
export class AppModule {}
