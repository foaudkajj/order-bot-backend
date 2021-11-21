import {Body, Controller, Get, Delete, Post, Request} from '@nestjs/common';
import {AllowAnonymous} from 'src/panel/decorators/public.decorator';
import {AddOrDeletePaymentMethodDto} from 'src/panel/dtos/AddOrDeletePaymentMethodDto';
import {DxGridDeleteRequest} from 'src/panel/dtos/DxGridDeleteRequest';
import {UIResponseBase} from 'src/panel/dtos/UIResponseBase';
import {GetirController} from './getir.controller';
import {GetirService} from './getir.service';

@Controller('api/Getir')
export class GetirRestaurantEndPointsController extends GetirController {
  @Get('GetRestaurantDetails')
  async GetRestaurantDetails(@Request() request): Promise<UIResponseBase<any>> {
    const {MerchantId} = request.user;
    return await this.getirService.GetRestaurantDetails(MerchantId);
  }

  @Get('GetRestaurantMenusAndOptions')
  async GetRestaurantMenusAndOptions(
    @Request() request,
  ): Promise<UIResponseBase<any>> {
    const {MerchantId} = request.user;
    return await this.getirService.GetRestaurantMenusAndOptions(MerchantId);
  }
}
