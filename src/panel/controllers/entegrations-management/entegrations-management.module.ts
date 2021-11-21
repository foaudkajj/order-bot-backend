import {Module} from '@nestjs/common';
import {GetirModule} from './Getir/getir.module';
import {YemekSepetiModule} from './YemekSepeti/yemeksepeti.module';

@Module({
  imports: [GetirModule, YemekSepetiModule],
  controllers: [],
  providers: [],
})
export class EntegrationsModule {}
