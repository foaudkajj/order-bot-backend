import { Request, Controller, Get, Post, UseGuards, Query, Body } from '@nestjs/common';
import { Role } from 'src/DB/models/Role';
import { DataSourceLoadOptionsBase } from 'src/panel/dtos/DevextremeQuery';
import { DxGridDeleteRequest } from 'src/panel/dtos/DxGridDeleteRequest';
import { DxGridUpdateRequest } from 'src/panel/dtos/DxGridUpdateRequest';
import { GetRolesDto } from 'src/panel/dtos/GetRolesDto';
import { RoleIdAndPermessions } from 'src/panel/dtos/RoleIdAndPermessions';
import { UIResponseBase } from 'src/panel/dtos/UIResponseBase';
import { PermessionsGuard } from '../../decorators/permessions.decorator';
import { PermessionEnum } from '../../enums/Permession';
import { RoleService } from './role.service';

@Controller('api/Roles')
export class RoleController {

    constructor(private roleService: RoleService) {

    }

    @Get('Get')
    @PermessionsGuard(PermessionEnum.SHOW_ROLE)
    async Get(@Query() query: DataSourceLoadOptionsBase): Promise<UIResponseBase<GetRolesDto>> {
        let result = await this.roleService.GetRoles(query);
        return result;
    }

    @Get('GetPermessions')
    async GetPermessions(@Query() query: DataSourceLoadOptionsBase) {
        let result = await this.roleService.GetPermessions(query);

        return result;
    }

    @Post('SaveRolePermessions')
    @PermessionsGuard(PermessionEnum.UPDATE_ROLE)
    async SaveRolePermessions(@Body() roleIdAndPermessions: RoleIdAndPermessions) {
        let result = await this.roleService.SaveRolePermessions(roleIdAndPermessions);

        return result;
    }

    @Post('Insert')
    @PermessionsGuard(PermessionEnum.ADD_ROLE)
    async Insert(@Body() request): Promise<UIResponseBase<Role>> {
        let role = JSON.parse(request.values) as Role;
        let result = await this.roleService.Insert(role);
        return result;
    }

    @Post('Update')
    @PermessionsGuard(PermessionEnum.UPDATE_ROLE)
    async Update(@Body() request: DxGridUpdateRequest): Promise<UIResponseBase<Role>> {
        let role = { ...JSON.parse(request.values) } as Role;
        role.Id = request.key;
        let result = await this.roleService.Update(role);
        return result;
    }

    @Post('Delete')
    @PermessionsGuard(PermessionEnum.DELETE_ROLE)
    async Delete(@Body() deleteRequest: DxGridDeleteRequest): Promise<UIResponseBase<Role>> {
        let result = await this.roleService.Delete(deleteRequest.key);
        return result;
    }
}