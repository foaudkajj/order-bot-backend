import { Request, Controller, Get, Post, UseGuards, Query, Body } from '@nestjs/common';
import { DataSourceLoadOptionsBase } from 'src/panel/dtos/DevextremeQuery';
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
    @PermessionsGuard(PermessionEnum.SHOW_ROLE)
    async GetPermessions(@Query() query: DataSourceLoadOptionsBase) {
        let result = await this.roleService.GetPermessions(query);

        return result;
    }

    @Post('SaveRolePermessions')
    @PermessionsGuard(PermessionEnum.SHOW_ROLE)
    async SaveRolePermessions(@Body() roleIdAndPermessions: RoleIdAndPermessions) {
        let result = await this.roleService.SaveRolePermessions(roleIdAndPermessions);

        return result;
    }
}