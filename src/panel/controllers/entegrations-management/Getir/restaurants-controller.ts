import { Controller, Get, Request } from '@nestjs/common';
import { UIResponseBase } from 'src/panel/dtos/UIResponseBase';
import { GetirController } from './getir.controller';

@Controller('api/Getir')
export class GetirRestaurantEndPointsController extends GetirController {
  @Get('GetRestaurantDetails')
  async GetRestaurantDetails (@Request() request): Promise<UIResponseBase<any>> {
    const { MerchantId } = request.user;
    return await this.getirService.GetRestaurantDetails(MerchantId);
  }

  @Get('GetRestaurantMenusAndOptions')
  async GetRestaurantMenusAndOptions (
    @Request() request
  ): Promise<UIResponseBase<any>> {
    const { MerchantId } = request.user;
    return await this.getirService.GetRestaurantMenusAndOptions(MerchantId);
  }
}
