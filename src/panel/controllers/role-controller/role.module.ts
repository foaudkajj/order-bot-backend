import {Module} from '@nestjs/common';
import {SharedModule} from 'src/shared.module';
import {RoleController} from './role.controller';
import {RoleService} from './role.service';

@Module({
  imports: [SharedModule],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [],
})
export class RoleModule {}
