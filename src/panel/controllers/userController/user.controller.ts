import {
  Request,
  Controller,
  Get,
  Post,
  UseGuards,
  Query,
  Body,
} from '@nestjs/common';
import {User} from 'src/db/models/user';
import {PermessionsGuard} from 'src/panel/decorators/permessions.decorator';
import {DataSourceLoadOptionsBase} from 'src/panel/dtos/devextreme-query';
import {DxGridDeleteRequest} from 'src/panel/dtos/dx-grid-delete-request';
import {DxGridUpdateRequest} from 'src/panel/dtos/dx-grid-update-request';
import {LoginResponse} from 'src/panel/dtos/login-response';
import {UIResponseBase} from 'src/panel/dtos/ui-response-base';
import {PermessionEnum} from 'src/panel/enums/PermessionsEnum';
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
  @PermessionsGuard(PermessionEnum.SHOW_USER)
  async Get(
    @Query() query: DataSourceLoadOptionsBase,
  ): Promise<UIResponseBase<User>> {
    const result = await this.userService.Get(query);
    return result;
  }

  @Post('Insert')
  @PermessionsGuard(PermessionEnum.ADD_USER)
  async Insert(@Body() request): Promise<UIResponseBase<User>> {
    const user = JSON.parse(request.values) as User;
    user.LastSuccesfulLoginDate = new Date();
    const result = await this.userService.Insert(user);
    return result;
  }

  @Post('Update')
  @PermessionsGuard(PermessionEnum.UPDATE_USER)
  async Update(
    @Body() request: DxGridUpdateRequest,
  ): Promise<UIResponseBase<User>> {
    const user = {...JSON.parse(request.values)} as User;
    user.Id = request.key;
    const result = await this.userService.Update(user);
    return result;
  }

  @Post('Delete')
  @PermessionsGuard(PermessionEnum.DELETE_USER)
  async Delete(
    @Body() deleteRequest: DxGridDeleteRequest,
  ): Promise<UIResponseBase<User>> {
    const result = await this.userService.Delete(deleteRequest.key);
    return result;
  }
}
