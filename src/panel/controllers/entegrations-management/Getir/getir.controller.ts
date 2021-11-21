import {
  Body,
  Controller,
  Get,
  Delete,
  Post,
  Request,
  Headers,
} from '@nestjs/common';
import {AllowAnonymous} from 'src/panel/decorators/public.decorator';
import {AddOrDeletePaymentMethodDto} from 'src/panel/dtos/AddOrDeletePaymentMethodDto';
import {DxGridDeleteRequest} from 'src/panel/dtos/DxGridDeleteRequest';
import {UIResponseBase} from 'src/panel/dtos/UIResponseBase';
import GetirToken from 'src/panel/helpers/GetirTokenHelper';
import {FoodOrderDto} from './Getir-Dtos/foodOrderDto';
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
    let result = await this.getirService.AddPaymentMethod(
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
    let result = await this.getirService.ActivateDeactivateRestaurantPaymentMethods(
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
    let result = await this.getirService.ActivateDeactivateProductStatus(
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
    let result = await this.getirService.ActivateDeactivateOptionProduct(
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
    let result = await this.getirService.ActivateInActiveOptionProducts(
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
    let result = await this.getirService.ActivateInActiveProductsAsOptions(
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
    let result = await this.getirService.UpdateOptionStatusInSpecificProductAndCategory(
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
    @Headers() Headers,
  ): Promise<string> {
    // const { MerchantId } = request.user;
    console.log(Headers);
    await this.getirService.OrderReceived(1, body);
    return 'Ok';
  }

  @Post('OrderCanceled')
  @AllowAnonymous()
  async OrderCanceled(
    @Request() request,
    @Headers() Headers,
    @Body() body,
  ): Promise<string> {
    // const { MerchantId } = request.user;
    console.log(Headers);
    await this.getirService.OrderCanceled(1, body);
    return 'Ok';
  }
}
