import {
  Request,
  Controller,
  Get,
  Post,
  UseGuards,
  Query,
  Body,
} from '@nestjs/common';
import {User} from 'src/models/user';
import {PermissionsGuard} from 'src/panel/decorators/permissions.decorator';
import {DataSourceLoadOptionsBase} from 'src/panel/dtos/devextreme-query';
import {DxGridDeleteRequest} from 'src/panel/dtos/dx-grid-delete-request';
import {DxGridUpdateRequest} from 'src/panel/dtos/dx-grid-update-request';
import {LoginResponse} from 'src/panel/dtos/login-response';
import {UIResponseBase} from 'src/panel/dtos/ui-response-base';
import {PermissionEnum} from 'src/panel/enums/permissions-enum';
import {AllowAnonymous} from '../../decorators/public.decorator';
import {AuthService} from '../../passport/auth.service';
import {LocalAuthGuard} from '../../passport/guards/local-auth.guard';
import {UserService} from './user.service';

@Controller('api/User')
export class UserController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('Login')
  @AllowAnonymous()
  @UseGuards(LocalAuthGuard)
  async login(@Request() req): Promise<LoginResponse> {
    return this.authService.login(req.user);
  }

  @Get('Get')
  @PermissionsGuard(PermissionEnum.SHOW_USER)
  async Get(
    @Query() query: DataSourceLoadOptionsBase,
  ): Promise<UIResponseBase<User[]>> {
    const result = await this.userService.Get(query);
    return result;
  }

  @Post('Insert')
  @PermissionsGuard(PermissionEnum.ADD_USER)
  async Insert(
    @Body() body,
    @Request() request,
  ): Promise<UIResponseBase<User>> {
    const user = JSON.parse(body.values) as User;
    user.merchantId = request.merchantId;
    user.lastSuccesfulLoginDate = new Date();
    const result = await this.userService.Insert(user);
    return result;
  }

  @Post('Update')
  @PermissionsGuard(PermissionEnum.UPDATE_USER)
  async Update(
    @Body() update: DxGridUpdateRequest,
  ): Promise<UIResponseBase<User>> {
    const user = {...JSON.parse(update.values)} as User;
    user.id = update.key;
    const result = await this.userService.Update(user);
    return result;
  }

  @Post('Delete')
  @PermissionsGuard(PermissionEnum.DELETE_USER)
  async Delete(@Body() deleteRequest: DxGridDeleteRequest): Promise<void> {
    return this.userService.Delete(deleteRequest.key);
  }
}
