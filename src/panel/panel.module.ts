import { Module } from '@nestjs/common';
import { BotManagementModule } from './controllers/bot-management-controllers/bot-management.module';
import { RoleModule } from './controllers/role-controller/role.module';
import { LoginModule } from './controllers/userController/user.module';

@Module({
    imports: [LoginModule, RoleModule, BotManagementModule],
    controllers: [],
    providers: [],
})
export class PanelModule { }
