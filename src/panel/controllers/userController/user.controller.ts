import { Request, Controller, Get, Post, UseGuards, Query, Body } from '@nestjs/common';
import { User } from 'src/DB/models/User';
import { PermessionsGuard } from 'src/panel/decorators/permessions.decorator';
import { DataSourceLoadOptionsBase } from 'src/panel/dtos/DevextremeQuery';
import { DxGridDeleteRequest } from 'src/panel/dtos/DxGridDeleteRequest';
import { DxGridUpdateRequest } from 'src/panel/dtos/DxGridUpdateRequest';
import { LoginResponse } from 'src/panel/dtos/loginResponse';
import { UIResponseBase } from 'src/panel/dtos/UIResponseBase';
import { PermessionEnum } from 'src/panel/enums/PermessionsEnum';
import { AllowAnonymous } from '../../decorators/public.decorator';
import { AuthService } from '../../passport/auth.service';
import { LocalAuthGuard } from '../../passport/guards/local-auth.guard';
import { UserService } from './user.service';

@Controller('api/User')
export class UserController {
    constructor(private authService: AuthService, private userService: UserService) {

    }

    @Post('Login')
    @AllowAnonymous()
    @UseGuards(LocalAuthGuard)
    async login(@Request() req): Promise<LoginResponse> {
        return this.authService.login(req.user);
    }

    @Get('Get')
    @PermessionsGuard(PermessionEnum.SHOW_USER)
    async Get(@Query() query: DataSourceLoadOptionsBase): Promise<UIResponseBase<User>> {
        let result = await this.userService.Get(query);
        return result;
    }

    @Post('Insert')
    @PermessionsGuard(PermessionEnum.ADD_USER)
    async Insert(@Body() request): Promise<UIResponseBase<User>> {
        let user = JSON.parse(request.values) as User;
        user.LastSuccesfulLoginDate = new Date()
        let result = await this.userService.Insert(user);
        return result;
    }

    @Post('Update')
    @PermessionsGuard(PermessionEnum.UPDATE_USER)
    async Update(@Body() request: DxGridUpdateRequest): Promise<UIResponseBase<User>> {
        let user = { ...JSON.parse(request.values) } as User;
        user.Id = request.key;
        let result = await this.userService.Update(user);
        return result;
    }

    @Post('Delete')
    @PermessionsGuard(PermessionEnum.DELETE_USER)
    async Delete(@Body() deleteRequest: DxGridDeleteRequest): Promise<UIResponseBase<User>> {
        let result = await this.userService.Delete(deleteRequest.key);
        return result;
    }

}