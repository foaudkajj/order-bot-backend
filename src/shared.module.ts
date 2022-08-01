import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {
  CategoryRepository,
  CustomerRepository,
  MenuRepository,
  MerchantRepository,
  OptionCategoryRepository,
  OptionRepository,
  OrderItemRepository,
  OrderRepository,
  PermissionRepository,
  ProductRepository,
  RoleRepository,
  UserRepository,
} from './db/repositories';
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
    CustomerRepository,
    MerchantRepository,
    OrderRepository,
    CategoryRepository,
    ProductRepository,
    OrderItemRepository,
    OptionCategoryRepository,
    OptionRepository,
    PermissionRepository,
    RoleRepository,
    UserRepository,
    MenuRepository,
  ],
  exports: [
    DevextremeLoadOptionsService,
    TypeOrmModule,
    CustomerRepository,
    MerchantRepository,
    OrderRepository,
    CategoryRepository,
    ProductRepository,
    OrderItemRepository,
    OptionCategoryRepository,
    OptionRepository,
    PermissionRepository,
    RoleRepository,
    UserRepository,
    MenuRepository,
  ],
})
/**
 * This module contains only system wide used services (like repositories)
 */
export class SharedModule {}
