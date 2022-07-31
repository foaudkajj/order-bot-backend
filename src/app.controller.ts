import {Controller, Get} from '@nestjs/common';
import {AppService} from './app.service';
import {AllowAnonymous} from './panel/decorators/public.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @AllowAnonymous()
  getHello(): string {
    return `env: ${process.env.NODE_ENV} - db: ${process.env.DB_HOST} - version: ${process.env.npm_package_version}`;
  }
}
