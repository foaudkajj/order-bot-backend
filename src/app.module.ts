import {Module} from '@nestjs/common';
import {APP_FILTER, APP_GUARD, APP_INTERCEPTOR} from '@nestjs/core';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {PermissionsGuard} from './panel/passport/guards/permissions.guard';
import {PanelModule} from './panel/panel.module';
import {JwtAuthGuard} from './panel/passport/guards/jwt-auth.guard';
import {ConfigModule} from '@nestjs/config';
import {TypeOrmModule} from '@nestjs/typeorm';
import {SharedModule} from './shared.module';
import {MerchantInterceptor} from './panel/interceptors/merchant.interceptor';
import {CustomNamingStrategy} from './naming-strategy';
import {BotModule} from './bot/bot.module';
import {HttpExceptionFilter} from './shared/exception-filter';
import {ScheduleModule} from '@nestjs/schedule';
import {CronModule} from './crons/cron.module';
import {LoggerModule} from './logger';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        `${process.env.NODE_ENV}`.trim() === 'production'
          ? '.production.env'
          : '.env',
      ],
    }),
    LoggerModule,
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
      migrations: ['migrations/*.js'],
    }),
    PanelModule,
    SharedModule,
    BotModule,
    ScheduleModule.forRoot(),
    CronModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
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
  ],
})
export class AppModule {}
