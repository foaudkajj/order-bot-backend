import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {
  CustomerRepository,
  MerchantRepository,
  OrderRepository,
} from './bot/custom-repositories';
import {FirstMessageHandler} from './bot/helpers';
import {DevextremeLoadOptionsService} from './db/helpers/devextreme-loadoptions';
import {
  OrderItem,
  Product,
  Category,
  GetirOrder,
  Menu,
  Merchant,
  Permission,
  RoleAndPermission,
  Role,
  User,
  Option,
  OptionCategory,
  Customer,
  Order,
  OrderOption,
} from './db/models';
import {StorageBlobService} from './services';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Customer,
      Order,
      OrderItem,
      Product,
      Category,
      GetirOrder,
      Menu,
      Merchant,
      Permission,
      Product,
      RoleAndPermission,
      Role,
      User,
      Option,
      OptionCategory,
      OrderOption,
    ]),
  ],
  controllers: [],
  providers: [
    DevextremeLoadOptionsService,
    StorageBlobService,
    CustomerRepository,
    MerchantRepository,
    OrderRepository,
    FirstMessageHandler,
  ],
  exports: [
    DevextremeLoadOptionsService,
    TypeOrmModule,
    StorageBlobService,
    CustomerRepository,
    MerchantRepository,
    OrderRepository,
    FirstMessageHandler,
  ],
})
export class SharedModule {}
