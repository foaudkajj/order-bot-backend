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
import {DxGridDeleteRequest} from 'src/panel/dtos/dx-grid-delete.request';
import {DxGridUpdateRequest} from 'src/panel/dtos/dx-grid-update.request';
import {LoginResponse} from 'src/panel/dtos/login.response';
import {UIResponseBase} from 'src/panel/dtos/ui-response-base';
import {PermissionEnum} from 'src/panel/enums/permissions-enum';
import {AllowAnonymous} from '../../decorators/public.decorator';
import {AuthService} from '../../passport/auth.service';
import {LocalAuthGuard} from '../../passport/guards/local-auth.guard';
import {UserService} from './user.service';

@Controller('api/user')
export class UserController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('login')
  @AllowAnonymous()
  @UseGuards(LocalAuthGuard)
  async login(@Request() req): Promise<LoginResponse> {
    return this.authService.login(req.user);
  }

  @Get('get')
  @PermissionsGuard(PermissionEnum.SHOW_USER)
  async Get(
    @Query() query: DataSourceLoadOptionsBase,
    @Request() request,
  ): Promise<UIResponseBase<User[]>> {
    const result = await this.userService.get(query, request.merchantId);
    return result;
  }

  @Post('insert')
  @PermissionsGuard(PermissionEnum.ADD_USER)
  async Insert(
    @Body() body,
    @Request() request,
  ): Promise<UIResponseBase<User>> {
    const user = JSON.parse(body.values) as User;
    user.merchantId = request.merchantId;
    user.lastSuccesfulLoginDate = new Date();
    const result = await this.userService.insert(user);
    return result;
  }

  @Post('update')
  @PermissionsGuard(PermissionEnum.UPDATE_USER)
  async Update(
    @Body() update: DxGridUpdateRequest,
  ): Promise<UIResponseBase<User>> {
    const user = {...JSON.parse(update.values)} as User;
    user.id = update.key;
    const result = await this.userService.update(user);
    return result;
  }

  @Post('delete')
  @PermissionsGuard(PermissionEnum.DELETE_USER)
  async Delete(
    @Body() deleteRequest: DxGridDeleteRequest,
    @Request() request,
  ): Promise<void> {
    return this.userService.delete(deleteRequest.key, request.merchantId);
  }
}
