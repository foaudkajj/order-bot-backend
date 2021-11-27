import {Injectable} from '@nestjs/common';
import {DevextremeLoadOptionsService} from 'src/db/helpers/devextreme-loadoptions';

@Injectable()
export class YemekSepetiService {
  constructor(private devextremeLoadOptions: DevextremeLoadOptionsService) {}
}
