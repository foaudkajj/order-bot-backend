import {Injectable} from '@nestjs/common';
import {DevextremeService} from 'src/services/devextreme.service';

@Injectable()
export class YemekSepetiService {
  constructor(private devextremeLoadOptions: DevextremeService) {}
}
