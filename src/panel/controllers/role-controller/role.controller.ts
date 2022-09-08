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

@Controller('api/Roles')
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Get('Get')
  @PermissionsGuard(PermissionEnum.SHOW_ROLE)
  async Get(
    @Query() query: DataSourceLoadOptionsBase,
  ): Promise<UIResponseBase<GetRolesDto[]>> {
    const result = await this.roleService.GetRoles(query);
    return result;
  }

  @Get('GetPermissions')
  async GetPermissions(@Query() query: DataSourceLoadOptionsBase) {
    const result = await this.roleService.GetPermissions(query);

    return result;
  }

  @Post('SaveRolePermissions')
  @PermissionsGuard(PermissionEnum.UPDATE_ROLE)
  async SaveRolePermissions(
    @Body() roleIdAndPermissions: RoleIdAndPermissionsRequest,
  ) {
    const result = await this.roleService.SaveRolePermissions(
      roleIdAndPermissions,
    );

    return result;
  }

  @Post('Insert')
  @PermissionsGuard(PermissionEnum.ADD_ROLE)
  async Insert(@Body() request): Promise<UIResponseBase<Role>> {
    const role = JSON.parse(request.values) as Role;
    const result = await this.roleService.Insert(role);
    return result;
  }

  @Post('Update')
  @PermissionsGuard(PermissionEnum.UPDATE_ROLE)
  async Update(
    @Body() request: DxGridUpdateRequest,
  ): Promise<UIResponseBase<Role>> {
    const role = {...JSON.parse(request.values)} as Role;
    role.id = request.key;
    const result = await this.roleService.Update(role);
    return result;
  }

  @Post('Delete')
  @PermissionsGuard(PermissionEnum.DELETE_ROLE)
  async Delete(@Body() deleteRequest: DxGridDeleteRequest): Promise<void> {
    return this.roleService.Delete(deleteRequest.key);
  }
}
