import { Module } from '@nestjs/common';
import { SharedModule } from 'src/shared.module';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
    imports: [SharedModule],
    controllers: [OrderController],
    providers: [OrderService],
    exports: []
})
export class OrderModule { }
