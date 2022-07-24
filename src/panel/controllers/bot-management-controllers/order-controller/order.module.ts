import {HttpModule} from '@nestjs/axios';
import {Module} from '@nestjs/common';
import {SharedModule} from 'src/shared.module';
import {GetirService} from '../../entegrations-management/getir/getir.service';
import {OrderController} from './order.controller';
import {OrderService} from './order.service';

@Module({
  imports: [SharedModule, HttpModule],
  controllers: [OrderController],
  providers: [OrderService, GetirService],
  exports: [],
})
export class OrderModule {}
