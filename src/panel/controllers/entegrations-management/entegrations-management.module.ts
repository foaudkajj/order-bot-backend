import {Module} from '@nestjs/common';
import {GetirModule} from './getir/getir.module';
import {YemekSepetiModule} from './yemek-sepeti/yemeksepeti.module';

@Module({
  imports: [GetirModule, YemekSepetiModule],
  controllers: [],
  providers: [],
})
export class EntegrationsModule {}
