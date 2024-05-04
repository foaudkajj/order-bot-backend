import {Controller, Get} from '@nestjs/common';
import {AppService} from './app.service';
import {AllowAnonymous} from './panel/decorators/public.decorator';
import {UIResponseBase} from './panel/dtos';

@Controller('api/app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @AllowAnonymous()
  getEnv(): string {
    return `node-version: ${process.env.NODE_ENV} - db: ${process.env.DB_HOST} - version: ${require('./package.json').version}`;
  }

  @Get('version')
  @AllowAnonymous()
  getVersion(): UIResponseBase<string> {
    return <UIResponseBase<string>>{data: `${process.env.npm_package_version}`};
  }
}
