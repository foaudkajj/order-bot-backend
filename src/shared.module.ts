import {Module} from '@nestjs/common';
import {DevextremeLoadOptionsService} from './DB/Helpers/devextreme-loadoptions';

@Module({
  imports: [],
  controllers: [],
  providers: [DevextremeLoadOptionsService],
  exports: [DevextremeLoadOptionsService],
})
export class SharedModule {}
