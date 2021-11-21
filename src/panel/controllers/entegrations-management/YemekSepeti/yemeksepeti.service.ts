import {Injectable} from '@nestjs/common';
import {DevextremeLoadOptionsService} from 'src/DB/Helpers/devextreme-loadoptions';

@Injectable()
export class YemekSepetiService {
  constructor(private devextremeLoadOptions: DevextremeLoadOptionsService) {}
}
