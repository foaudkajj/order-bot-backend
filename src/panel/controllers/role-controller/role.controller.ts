import {Controller, Get, Post, Query, Body} from '@nestjs/common';
import {Role} from 'src/models/role';
import {DataSourceLoadOptionsBase} from 'src/panel/dtos/devextreme-query';
import {DxGridDeleteRequest} from 'src/panel/dtos/dx-grid-delete.request';
import {DxGridUpdateRequest} from 'src/panel/dtos/dx-grid-update.request';
import {GetRolesDto} from 'src/panel/dtos/get-roles.dto';
import {RoleIdAndPermissionsRequest} from 'src/panel/dtos/role-id-and-permissions.request';
import {UIResponseBase} from 'src/panel/dtos/ui-response-base';
import {PermissionsGuard} from '../../decorators/permissions.decorator';
import {PermissionEnum} from '../../enums/permissions-enum';
import {RoleService} from './role.service';

@Controller('api/roles')
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Get('get')
  @PermissionsGuard(PermissionEnum.SHOW_ROLE)
  async Get(
    @Query() query: DataSourceLoadOptionsBase,
  ): Promise<UIResponseBase<GetRolesDto[]>> {
    const result = await this.roleService.getRoles(query);
    return result;
  }

  @Get('get-permissions')
  async GetPermissions(@Query() query: DataSourceLoadOptionsBase) {
    const result = await this.roleService.getPermissions(query);

    return result;
  }

  @Post('save-role-permissions')
  @PermissionsGuard(PermissionEnum.UPDATE_ROLE)
  async SaveRolePermissions(
    @Body() roleIdAndPermissions: RoleIdAndPermissionsRequest,
  ) {
    const result = await this.roleService.saveRolePermissions(
      roleIdAndPermissions,
    );

    return result;
  }

  @Post('insert')
  @PermissionsGuard(PermissionEnum.ADD_ROLE)
  async Insert(@Body() request): Promise<UIResponseBase<Role>> {
    const role = JSON.parse(request.values) as Role;
    const result = await this.roleService.insert(role);
    return result;
  }

  @Post('update')
  @PermissionsGuard(PermissionEnum.UPDATE_ROLE)
  async Update(
    @Body() request: DxGridUpdateRequest,
  ): Promise<UIResponseBase<Role>> {
    const role = {...JSON.parse(request.values)} as Role;
    role.id = request.key;
    const result = await this.roleService.update(role);
    return result;
  }

  @Post('delete')
  @PermissionsGuard(PermissionEnum.DELETE_ROLE)
  async Delete(@Body() deleteRequest: DxGridDeleteRequest): Promise<void> {
    return this.roleService.delete(deleteRequest.key);
  }
}
