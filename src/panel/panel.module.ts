import { Module } from '@nestjs/common';
import { LoginModule } from './userController/user.module';

@Module({
    imports: [LoginModule],
    controllers: [],
    providers: [],
})
export class PanelModule { }
