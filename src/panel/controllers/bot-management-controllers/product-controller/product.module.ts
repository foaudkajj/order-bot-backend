import {Module} from '@nestjs/common';
import {FreeImageHostingService} from 'src/services';
import {SharedModule} from 'src/shared.module';
import {ProductController} from './product.controller';
import {ProductService} from './product.service';

@Module({
  imports: [SharedModule],
  controllers: [ProductController],
  providers: [ProductService, FreeImageHostingService],
  exports: [],
})
export class ProductModule {}
