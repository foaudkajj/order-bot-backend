import {Module} from '@nestjs/common';
import {SharedModule} from 'src/shared.module';
import {CategoryController} from './category.controller';
import {CategoryService} from './category.service';

@Module({
  imports: [SharedModule],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [],
})
export class CategoryModule {}
