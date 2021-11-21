import { Module } from '@nestjs/common';
import { CategoryModule } from './category-controller/category.module';
import { OrderModule } from './order-controller/order.module';
import { ProductModule } from './product-controller/product.module';

@Module({
  imports: [CategoryModule, ProductModule, OrderModule],
  controllers: [],
  providers: []
})
export class BotManagementModule {}
