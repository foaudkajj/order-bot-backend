import {CacheModule, HttpModule, Module} from '@nestjs/common';
import {SharedModule} from 'src/shared.module';
import {GetirController} from './getir.controller';
import {GetirService} from './getir.service';
import {GetirRestaurantEndPointsController} from './restaurants-controller';

@Module({
  imports: [SharedModule, CacheModule.register(), HttpModule],
  controllers: [GetirRestaurantEndPointsController],
  providers: [GetirService],
  exports: [],
})
export class GetirModule {}
