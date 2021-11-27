import {Controller, Get, Post, Query, Body} from '@nestjs/common';
import {Role} from 'src/db/models/Role';
import {DataSourceLoadOptionsBase} from 'src/panel/dtos/devextreme-query';
import {DxGridDeleteRequest} from 'src/panel/dtos/dx-grid-delete-request';
import {DxGridUpdateRequest} from 'src/panel/dtos/dx-grid-update-request';
import {GetRolesDto} from 'src/panel/dtos/get-roles-dto';
import {RoleIdAndPermessions} from 'src/panel/dtos/role-id-and-permessions';
import {UIResponseBase} from 'src/panel/dtos/ui-response-base';
import {PermessionsGuard} from '../../decorators/permessions.decorator';
import {PermessionEnum} from '../../enums/PermessionsEnum';
import {RoleService} from './role.service';

@Controller('api/Roles')
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Get('Get')
  @PermessionsGuard(PermessionEnum.SHOW_ROLE)
  async Get(
    @Query() query: DataSourceLoadOptionsBase,
  ): Promise<UIResponseBase<GetRolesDto>> {
    const result = await this.roleService.GetRoles(query);
    return result;
  }

  @Get('GetPermessions')
  async GetPermessions(@Query() query: DataSourceLoadOptionsBase) {
    const result = await this.roleService.GetPermessions(query);

    return result;
  }

  @Post('SaveRolePermessions')
  @PermessionsGuard(PermessionEnum.UPDATE_ROLE)
  async SaveRolePermessions(
    @Body() roleIdAndPermessions: RoleIdAndPermessions,
  ) {
    const result = await this.roleService.SaveRolePermessions(
      roleIdAndPermessions,
    );

    return result;
  }

  @Post('Insert')
  @PermessionsGuard(PermessionEnum.ADD_ROLE)
  async Insert(@Body() request): Promise<UIResponseBase<Role>> {
    const role = JSON.parse(request.values) as Role;
    const result = await this.roleService.Insert(role);
    return result;
  }

  @Post('Update')
  @PermessionsGuard(PermessionEnum.UPDATE_ROLE)
  async Update(
    @Body() request: DxGridUpdateRequest,
  ): Promise<UIResponseBase<Role>> {
    const role = {...JSON.parse(request.values)} as Role;
    role.Id = request.key;
    const result = await this.roleService.Update(role);
    return result;
  }

  @Post('Delete')
  @PermessionsGuard(PermessionEnum.DELETE_ROLE)
  async Delete(
    @Body() deleteRequest: DxGridDeleteRequest,
  ): Promise<UIResponseBase<Role>> {
    const result = await this.roleService.Delete(deleteRequest.key);
    return result;
  }
}
