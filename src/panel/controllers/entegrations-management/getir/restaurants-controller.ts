import { Controller, Get, Request } from '@nestjs/common';
import { UIResponseBase } from 'src/panel/dtos/ui-response-base';
import { GetirController } from './getir.controller';

@Controller('api/Getir')
export class GetirRestaurantEndPointsController extends GetirController {
  @Get('GetRestaurantDetails')
  async GetRestaurantDetails(@Request() request): Promise<UIResponseBase<any>> {
    return await this.getirService.GetRestaurantDetails(request.merchantId);
  }

  @Get('GetRestaurantMenusAndOptions')
  async GetRestaurantMenusAndOptions(
    @Request() request,
  ): Promise<UIResponseBase<any>> {
    return await this.getirService.GetRestaurantMenusAndOptions(request.merchantId);
  }
}
