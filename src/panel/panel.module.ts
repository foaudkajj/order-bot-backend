import { Module } from '@nestjs/common';
import { BotManagementModule } from './controllers/bot-management-controllers/bot-management.module';
import { EntegrationsModule } from './controllers/entegrations-management/entegrations-management.module';
import { RoleModule } from './controllers/role-controller/role.module';
import { LoginModule } from './controllers/userController/user.module';

@Module({
  imports: [LoginModule, RoleModule, BotManagementModule, EntegrationsModule],
  controllers: [],
  providers: []
})
export class PanelModule {}
