import {HttpModule, Module} from '@nestjs/common';
import {SharedModule} from 'src/shared.module';
import {GetirService} from './getir.service';
import {GetirRestaurantEndPointsController} from './restaurants-controller';

@Module({
  imports: [SharedModule, HttpModule],
  controllers: [GetirRestaurantEndPointsController],
  providers: [GetirService],
  exports: [],
})
export class GetirModule {}
