import {Module} from '@nestjs/common';
import {SharedModule} from 'src/shared.module';
import {AuthModule} from '../../passport/auth.module';
import {UserController} from './user.controller';
import {UserService} from './user.service';

@Module({
  imports: [AuthModule, SharedModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [],
})
export class LoginModule {}
