import { Module } from '@nestjs/common';
import { SharedModule } from 'src/shared.module';
import { YemekSepetiController } from './yemeksepeti.controller';
import { YemekSepetiService } from './yemeksepeti.service';

@Module({
  imports: [SharedModule],
  controllers: [YemekSepetiController],
  providers: [YemekSepetiService],
  exports: []
})
export class YemekSepetiModule {}
