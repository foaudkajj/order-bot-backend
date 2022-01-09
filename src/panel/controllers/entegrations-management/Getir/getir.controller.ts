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
import {AllowAnonymous} from 'src/panel/decorators/public.decorator';
import {DxGridDeleteRequest} from 'src/panel/dtos/dx-grid-delete-request';
import {UIResponseBase} from 'src/panel/dtos/ui-response-base';
import {FoodOrderDto} from './getir-dtos/food-order-dto';
import {GetirService} from './getir.service';

@Controller('api/Getir')
export class GetirController {
  constructor(public getirService: GetirService) {}

  // @Post('AddOrDeletePaymentMethod')
  // async AddOrDeletePaymentMethod(@Body() body: AddOrDeletePaymentMethodDto, @Request() request): Promise<UIResponseBase<string>> {
  //     const { MerchantId } = request.user;
  //     return (await this.getirService.AddOrDeletePaymentMethod(MerchantId, body))
  // }

  @Get('GetRestaurantPaymentMethods')
  async GetRestaurantPaymentMethods(
    @Request() request,
  ): Promise<UIResponseBase<string>> {
    const {MerchantId} = request.user;
    return await this.getirService.GetRestaurantPaymentMethods(MerchantId);
  }

  @Delete('DeleteRestaurantPaymentMethods')
  async DeleteRestaurantPaymentMethods(
    @Request() request,
    @Body() deleteRequest: DxGridDeleteRequest,
  ): Promise<UIResponseBase<string>> {
    const {MerchantId} = request.user;
    return await this.getirService.DeleteRestaurantPaymentMethods(
      MerchantId,
      deleteRequest.key,
    );
  }

  @Get('GetAllPaymentMethods')
  async GetAllPaymentMethods(
    @Request() request,
  ): Promise<UIResponseBase<string>> {
    const {MerchantId} = request.user;
    return await this.getirService.GetAllPaymentMethods(MerchantId);
  }

  @Post('AddPaymentMethod')
  async AddPaymentMethod(
    @Request() request,
    @Body() body,
  ): Promise<UIResponseBase<any>> {
    const {MerchantId} = request.user;
    const result = await this.getirService.AddPaymentMethod(
      MerchantId,
      body.values,
    );
    return result;
  }

  @Post('ActivateDeactivateRestaurantPaymentMethods')
  async ActivateDeactivateRestaurantPaymentMethods(
    @Request() request,
    @Body() body,
  ): Promise<UIResponseBase<any>> {
    const {MerchantId} = request.user;
    const result = await this.getirService.ActivateDeactivateRestaurantPaymentMethods(
      MerchantId,
      body,
    );
    return result;
  }

  @Post('ActivateDeactivateProductStatus')
  async ActivateDeactivateProductStatus(
    @Request() request,
    @Body() body,
  ): Promise<UIResponseBase<any>> {
    const {MerchantId} = request.user;
    const result = await this.getirService.ActivateDeactivateProductStatus(
      MerchantId,
      body,
    );
    return result;
  }

  // @Post('ActivateDeactivateCategoryStatus')
  // async ActivateDeactivateCategoryStatus(@Request() request, @Body() body): Promise<UIResponseBase<any>> {
  //     const { MerchantId } = request.user;
  //     let result = await this.getirService.ActivateDeactivateCategoryStatus(MerchantId, body);
  //     return result;
  // }

  // @Get('CheckAndGetAccessToken')
  // async CheckAndGetAccessToken(@Request() request): Promise<UIResponseBase<string>> {
  //     const { MerchantId } = request.user;
  //     const token = await GetirToken.getToken(MerchantId);
  //     return (<UIResponseBase<string>>{ Result: token.Result })
  // }

  @Get('GetOptionProdcuts')
  async GetOptionProdcuts(@Request() request): Promise<UIResponseBase<string>> {
    const {MerchantId} = request.user;
    return await this.getirService.GetOptionProdcuts(MerchantId);
  }

  @Post('ActivateDeactivateOptionProduct')
  async ActivateDeactivateOptionProduct(
    @Request() request,
    @Body() body,
  ): Promise<UIResponseBase<any>> {
    const {MerchantId} = request.user;
    const result = await this.getirService.ActivateDeactivateOptionProduct(
      MerchantId,
      body,
    );
    return result;
  }

  @Post('UpdateRestaurantAndCourierInfo')
  async UpdateRestaurantAndCourierInfo(
    @Request() request,
    @Body() body,
  ): Promise<UIResponseBase<any>> {
    const {MerchantId} = request.user;
    return await this.getirService.UpdateRestaurantAndCourierInfo(
      MerchantId,
      body,
    );
  }

  // @Post('ActivateDeactivateAltOptions')
  // async ActivateDeactivateAltOptions(@Request() request, @Body() body): Promise<UIResponseBase<any>> {
  //     const { MerchantId } = request.user;
  //     let result = await this.getirService.ActivateDeactivateAltOptions(MerchantId, body);
  //     return result;
  // }

  @Post('ActivateInActiveOptionProducts')
  async ActivateInActiveOptions(
    @Request() request,
    @Body() body,
  ): Promise<UIResponseBase<any>> {
    const {MerchantId} = request.user;
    const result = await this.getirService.ActivateInActiveOptionProducts(
      MerchantId,
      body,
    );
    return result;
  }

  @Post('ActivateInActiveProductsAsOptions')
  async ActivateInActiveProductsAsOptions(
    @Request() request,
    @Body() body,
  ): Promise<UIResponseBase<any>> {
    const {MerchantId} = request.user;
    const result = await this.getirService.ActivateInActiveProductsAsOptions(
      MerchantId,
      body,
    );
    return result;
  }

  @Post('UpdateOptionStatusInSpecificProductAndCategory')
  async UpdateOptionStatusInSpecificProductAndCategory(
    @Request() request,
    @Body() body,
  ): Promise<UIResponseBase<any>> {
    const {MerchantId} = request.user;
    const result = await this.getirService.UpdateOptionStatusInSpecificProductAndCategory(
      MerchantId,
      body,
    );
    return result;
  }

  @Post('OrderReceived')
  @AllowAnonymous()
  async OrderReceived(
    @Body() body: FoodOrderDto,
    @Request() request,
    @Headers() headers,
  ): Promise<number> {
    // console.log(headers);
    // console.log(JSON.stringify(body));
    await this.getirService.OrderReceived(body);
    return HttpStatus.OK;
  }

  @Post('OrderCanceled')
  @AllowAnonymous()
  async OrderCanceled(@Headers() headers, @Body() body): Promise<number> {
    console.log(headers);
    await this.getirService.OrderCanceled(body);
    return HttpStatus.OK;
  }

  @Get('ImportUpdateGetirProducts')
  async importUpdateGetirProducts(@Request() request) {
    const {MerchantId} = request.user;
    return this.getirService.importUpdateGetirProducts(MerchantId);
  }

  @Get('verifyOrder')
  async verifyOrder(
    @Request() request,
    @Query('foodOrderId') foodOrderId: string,
  ) {
    const {MerchantId} = request.user;
    return this.getirService.verifyOrder(foodOrderId, MerchantId);
  }

  @Get('verifyFutureOrder')
  async verifyFutureOrder(
    @Request() request,
    @Query('orderId') orderId: string,
    @Query('foodOrderId') foodOrderId: string,
  ) {
    const {MerchantId} = request.user;
    return this.getirService.verifyFutureOrder(foodOrderId, MerchantId);
  }

  @Get('prepareOrder')
  async prepareOrder(
    @Request() request,
    @Query('foodOrderId') foodOrderId: string,
  ) {
    const {MerchantId} = request.user;
    return this.getirService.prepareOrder(foodOrderId, MerchantId);
  }

  @Get('deliverOrder')
  async deliverOrder(
    @Request() request,
    @Query('foodOrderId') foodOrderId: string,
  ) {
    const {MerchantId} = request.user;
    return this.getirService.deliverOrder(foodOrderId, MerchantId);
  }

  @Get('handoverOrder')
  async handoverOrder(
    @Request() request,
    @Query('foodOrderId') foodOrderId: string,
  ) {
    const {MerchantId} = request.user;
    return this.getirService.handoverOrder(foodOrderId, MerchantId);
  }
}
