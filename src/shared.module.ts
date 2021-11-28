import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {
  CustomerRepository,
  MerchantRepository,
  OrderRepository,
  TelegramUserRepository,
} from './bot/custom-repositories';
import {DevextremeLoadOptionsService} from './db/helpers/devextreme-loadoptions';
import {
  OrderItem,
  Product,
  Category,
  GetirOrder,
  Menu,
  Merchant,
  Permession,
  RoleAndPermession,
  Role,
  TelegramOrder,
  User,
} from './db/models';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CustomerRepository,
      OrderRepository,
      TelegramUserRepository,
      OrderItem,
      Product,
      Category,
      GetirOrder,
      Menu,
      Merchant,
      MerchantRepository,
      Permession,
      Product,
      RoleAndPermession,
      Role,
      TelegramOrder,
      User,
    ]),
  ],
  controllers: [],
  providers: [DevextremeLoadOptionsService],
  exports: [DevextremeLoadOptionsService, TypeOrmModule],
})
export class SharedModule {}
