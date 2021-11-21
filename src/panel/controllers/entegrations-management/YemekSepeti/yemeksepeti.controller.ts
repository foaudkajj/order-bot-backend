import {Controller} from '@nestjs/common';
import {YemekSepetiService} from './yemeksepeti.service';

@Controller('api/YemekSepeti')
export class YemekSepetiController {
  constructor(private orderService: YemekSepetiService) {}
}
