import {Module} from '@nestjs/common';
import {SharedModule} from 'src/shared.module';
import {CustomerService} from './customer.service';
import {CustomerController} from './customer.controller';

@Module({
  imports: [SharedModule],
  controllers: [CustomerController],
  providers: [CustomerService],
  exports: [],
})
export class CustomerModule {}
