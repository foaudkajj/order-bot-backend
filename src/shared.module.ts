import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {
  CustomerRepository,
  MerchantRepository,
  OrderRepository,
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
  User,
  Option,
  OptionCategory,
} from './db/models';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CustomerRepository,
      OrderRepository,
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
      User,
      Option,
      OptionCategory,
    ]),
  ],
  controllers: [],
  providers: [DevextremeLoadOptionsService],
  exports: [DevextremeLoadOptionsService, TypeOrmModule],
})
export class SharedModule {}
