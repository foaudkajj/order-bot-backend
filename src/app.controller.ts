import {Controller, Get} from '@nestjs/common';
import {AppService} from './app.service';
import {AllowAnonymous} from './panel/decorators/public.decorator';
import {UIResponseBase} from './panel/dtos';
import {promises as fs} from 'fs';

@Controller('api/app')
export class AppController {
  packageVersion: string;
  constructor(private readonly appService: AppService) {}

  @Get()
  @AllowAnonymous()
  async getEnv(): Promise<string> {
    if (!this.packageVersion) {
      const packageJson = await fs.readFile('package.json', {
        encoding: 'utf-8',
      });
      this.packageVersion = JSON.parse(packageJson).version;
    }
    return `node-version: ${process.env.NODE_ENV} - db: ${process.env.DB_HOST} - version: ${this.packageVersion}`;
  }

  @Get('version')
  @AllowAnonymous()
  getVersion(): UIResponseBase<string> {
    return <UIResponseBase<string>>{
      data: `${this.packageVersion}`,
    };
  }
}
