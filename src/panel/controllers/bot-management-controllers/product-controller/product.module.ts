import {Module} from '@nestjs/common';
import {StorageBlobService} from 'src/services';
import {SharedModule} from 'src/shared.module';
import {ProductController} from './product.controller';
import {ProductService} from './product.service';

@Module({
  imports: [SharedModule],
  controllers: [ProductController],
  providers: [ProductService, StorageBlobService],
  exports: [],
})
export class ProductModule {}
