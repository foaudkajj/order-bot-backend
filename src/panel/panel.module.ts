import { Module } from '@nestjs/common';
import { RoleModule } from './controllers/role-controller/role.module';
import { LoginModule } from './controllers/userController/user.module';

@Module({
    imports: [LoginModule, RoleModule],
    controllers: [],
    providers: [],
})
export class PanelModule { }
