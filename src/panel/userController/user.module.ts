import { Module } from '@nestjs/common';
import { AuthModule } from '../passport/auth.module';
import { UserController } from './user.controller';

@Module({
    imports: [AuthModule],
    controllers: [UserController],
    providers: [],
    exports: []
})
export class LoginModule { }
