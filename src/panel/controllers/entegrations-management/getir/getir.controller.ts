import {
  Body,
  Controller,
  Get,
  Delete,
  Post,
  Request,
  Headers,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { AllowAnonymous } from 'src/panel/decorators/public.decorator';
import { DxGridDeleteRequest } from 'src/panel/dtos/dx-grid-delete-request';
import { UIResponseBase } from 'src/panel/dtos/ui-response-base';
import { FoodOrderDto } from './getir-dtos/food-order-dto';
import { GetirService } from './getir.service';

@Controller('api/Getir')
export class GetirController {
  constructor(public getirService: GetirService) { }

  // @Post('AddOrDeletePaymentMethod')
  // async AddOrDeletePaymentMethod(@Body() body: AddOrDeletePaymentMethodDto, @Request() request): Promise<UIResponseBase<string>> {
  //     return (await this.getirService.AddOrDeletePaymentMethod(request.merchantId, body))
  // }

  @Get('GetRestaurantPaymentMethods')
  async GetRestaurantPaymentMethods(
    @Request() request,
  ): Promise<UIResponseBase<string>> {
    return await this.getirService.GetRestaurantPaymentMethods(request.merchantId);
  }

  @Delete('DeleteRestaurantPaymentMethods')
  async DeleteRestaurantPaymentMethods(
    @Request() request,
    @Body() deleteRequest: DxGridDeleteRequest,
  ): Promise<UIResponseBase<string>> {
    return await this.getirService.DeleteRestaurantPaymentMethods(
      request.merchantId,
      deleteRequest.key,
    );
  }

  @Get('GetAllPaymentMethods')
  async GetAllPaymentMethods(
    @Request() request,
  ): Promise<UIResponseBase<string>> {
    return await this.getirService.GetAllPaymentMethods(request.merchantId);
  }

  @Post('AddPaymentMethod')
  async AddPaymentMethod(
    @Request() request,
    @Body() body,
  ): Promise<UIResponseBase<any>> {
    const result = await this.getirService.AddPaymentMethod(
      request.merchantId,
      body.values,
    );
    return result;
  }

  @Post('ActivateDeactivateRestaurantPaymentMethods')
  async ActivateDeactivateRestaurantPaymentMethods(
    @Request() request,
    @Body() body,
  ): Promise<UIResponseBase<any>> {
    const result = await this.getirService.ActivateDeactivateRestaurantPaymentMethods(
      request.merchantId,
      body,
    );
    return result;
  }

  @Post('ActivateDeactivateProductStatus')
  async ActivateDeactivateProductStatus(
    @Request() request,
    @Body() body,
  ): Promise<UIResponseBase<any>> {
    const result = await this.getirService.ActivateDeactivateProductStatus(
      request.merchantId,
      body,
    );
    return result;
  }

  // @Post('ActivateDeactivateCategoryStatus')
  // async ActivateDeactivateCategoryStatus(@Request() request, @Body() body): Promise<UIResponseBase<any>> {
  //     let result = await this.getirService.ActivateDeactivateCategoryStatus(request.merchantId, body);
  //     return result;
  // }

  // @Get('CheckAndGetAccessToken')
  // async CheckAndGetAccessToken(@Request() request): Promise<UIResponseBase<string>> {
  //     const token = await GetirToken.getToken(request.merchantId);
  //     return (<UIResponseBase<string>>{ Result: token.result })
  // }

  @Get('GetOptionProdcuts')
  async GetOptionProdcuts(@Request() request): Promise<UIResponseBase<string>> {
    return await this.getirService.GetOptionProdcuts(request.merchantId);
  }

  @Post('ActivateDeactivateOptionProduct')
  async ActivateDeactivateOptionProduct(
    @Request() request,
    @Body() body,
  ): Promise<UIResponseBase<any>> {
    const result = await this.getirService.ActivateDeactivateOptionProduct(
      request.merchantId,
      body,
    );
    return result;
  }

  @Post('UpdateRestaurantAndCourierInfo')
  async UpdateRestaurantAndCourierInfo(
    @Request() request,
    @Body() body,
  ): Promise<UIResponseBase<any>> {
    return await this.getirService.UpdateRestaurantAndCourierInfo(
      request.merchantId,
      body,
    );
  }

  // @Post('ActivateDeactivateAltOptions')
  // async ActivateDeactivateAltOptions(@Request() request, @Body() body): Promise<UIResponseBase<any>> {
  //     let result = await this.getirService.ActivateDeactivateAltOptions(request.merchantId, body);
  //     return result;
  // }

  @Post('ActivateInActiveOptionProducts')
  async ActivateInActiveOptions(
    @Request() request,
    @Body() body,
  ): Promise<UIResponseBase<any>> {
    const result = await this.getirService.ActivateInActiveOptionProducts(
      request.merchantId,
      body,
    );
    return result;
  }

  @Post('ActivateInActiveProductsAsOptions')
  async ActivateInActiveProductsAsOptions(
    @Request() request,
    @Body() body,
  ): Promise<UIResponseBase<any>> {
    const result = await this.getirService.ActivateInActiveProductsAsOptions(
      request.merchantId,
      body,
    );
    return result;
  }

  @Post('UpdateOptionStatusInSpecificProductAndCategory')
  async UpdateOptionStatusInSpecificProductAndCategory(
    @Request() request,
    @Body() body,
  ): Promise<UIResponseBase<any>> {
    const result = await this.getirService.UpdateOptionStatusInSpecificProductAndCategory(
      request.merchantId,
      body,
    );
    return result;
  }

  @Post('OrderReceived')
  @AllowAnonymous()
  async OrderReceived(
    @Body() body: FoodOrderDto,
  ): Promise<number> {
    await this.getirService.OrderReceived(body);
    return HttpStatus.OK;
  }

  @Post('OrderCanceled')
  @AllowAnonymous()
  async OrderCanceled(@Headers() headers, @Body() body): Promise<number> {
    await this.getirService.OrderCanceled(body);
    return HttpStatus.OK;
  }

  @Get('ImportUpdateGetirProducts')
  async importUpdateGetirProducts(@Request() request) {
    return this.getirService.importUpdateGetirProducts(request.merchantId);
  }

  @Get('verifyOrder')
  async verifyOrder(
    @Request() request,
    @Query('foodOrderId') foodOrderId: string,
  ) {
    return this.getirService.verifyOrder(foodOrderId, request.merchantId);
  }

  @Get('verifyFutureOrder')
  async verifyFutureOrder(
    @Request() request,
    @Query('orderId') orderId: string,
    @Query('foodOrderId') foodOrderId: string,
  ) {
    return this.getirService.verifyFutureOrder(foodOrderId, request.merchantId);
  }

  @Get('prepareOrder')
  async prepareOrder(
    @Request() request,
    @Query('foodOrderId') foodOrderId: string,
  ) {
    return this.getirService.prepareOrder(foodOrderId, request.merchantId);
  }

  @Get('deliverOrder')
  async deliverOrder(
    @Request() request,
    @Query('foodOrderId') foodOrderId: string,
  ) {
    return this.getirService.deliverOrder(foodOrderId, request.merchantId);
  }

  @Get('handoverOrder')
  async handoverOrder(
    @Request() request,
    @Query('foodOrderId') foodOrderId: string,
  ) {
    return this.getirService.handoverOrder(foodOrderId, request.merchantId);
  }
}
