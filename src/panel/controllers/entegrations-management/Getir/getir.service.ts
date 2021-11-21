import {HttpService, Injectable} from '@nestjs/common';
import {MerchantRepository} from 'src/bot/custom-repositories/MerchantRepository';
import {DevextremeLoadOptionsService} from 'src/DB/Helpers/devextreme-loadoptions';
import {UIResponseBase} from 'src/panel/dtos/ui-response-base';
import {getCustomRepository, getRepository} from 'typeorm';
import {Endpoints} from './Getir-Enums/Endpoints';
import GetirToken from 'src/panel/helpers/GetirTokenHelper';
import {GetirOrderDetails} from 'src/DB/models/getir-prder';
import {Order} from 'src/DB/models/order';
import {FoodOrderDto} from './Getir-Dtos/foodOrderDto';
import {Customer} from 'src/DB/models/customer';
import {OrderChannel} from 'src/DB/models';

@Injectable()
export class GetirService {
  GetirAppSecretKey: string;
  GetirRestaurantSecretKey: string;
  merchantRepository = getCustomRepository(MerchantRepository);
  constructor(
    public devextremeLoadOptions: DevextremeLoadOptionsService,
    public httpService: HttpService,
  ) {
    console.log('here constructor');
  }

  // async AddOrDeletePaymentMethod(merchantId, body) {
  //     const token = await GetirToken.getToken(merchantId);
  //     let changePaymentMethodResponse;
  //     if (body.status == true) {
  //         changePaymentMethodResponse = await this.httpService.post<any[]>(process.env.GetirApi + Endpoints.AddRestaurantPaymentMethod, { paymentMethodId: body.paymentMethodId }, { headers: { 'token': token.Result, } }).toPromise();
  //     } else {
  //         changePaymentMethodResponse = await this.httpService.delete<any[]>(process.env.GetirApi + Endpoints.DeleteRestaurantPaymentMethod, { headers: { 'token': token.Result }, data: { paymentMethodId: body.paymentMethodId } }).toPromise();
  //     }

  //     if (changePaymentMethodResponse.status == 200) {
  //         return <UIResponseBase<any>>{ IsError: false, StatusCode: 200 }
  //     } else {
  //         return <UIResponseBase<any>>{ IsError: true }
  //     }

  // }

  // async GetRestaurantPaymentMethods(merchantId: number) {
  //     const token = await GetirToken.getToken(merchantId);
  //     const restaurantPaymentMethods = await this.httpService.get<any[]>(process.env.GetirApi + Endpoints.GetRestaurantPaymentMethods, { headers: { 'token': token.Result } }).toPromise();
  //     const availablePaymentMethods = await this.httpService.get<any[]>(process.env.GetirApi + Endpoints.listPaymentMethods, { headers: { 'token': token.Result } }).toPromise();

  //     const restaurantPaymentMethodsIds = restaurantPaymentMethods.data.map(mp => mp.id);

  //     const paymentMethodsToReturn = availablePaymentMethods.data.map(mp => {
  //         if (restaurantPaymentMethodsIds.includes(mp.id)) {
  //             mp.active = true;
  //         } else {
  //             mp.active = false;
  //         }
  //         return mp;
  //     });

  //     return <UIResponseBase<any>>{ data: paymentMethodsToReturn, totalCount: paymentMethodsToReturn.length, IsError: false, StatusCode: 200 }
  // }

  async GetRestaurantPaymentMethods(merchantId: number) {
    const token = await GetirToken.getToken(merchantId);
    const restaurantPaymentMethods = await this.httpService
      .get<any[]>(
        process.env.GetirApi + Endpoints.GetRestaurantPaymentMethods,
        {headers: {token: token.Result}},
      )
      .toPromise();

    return <UIResponseBase<any>>{
      data: restaurantPaymentMethods.data,
      totalCount: restaurantPaymentMethods.data.length,
      IsError: false,
      StatusCode: 200,
    };
  }

  async ActivateDeactivateRestaurantPaymentMethods(merchantId: number, body) {
    const {id, active} = body as {id; active};
    const token = await GetirToken.getToken(merchantId);

    const activeRequest = this.httpService.post<any>(
      process.env.GetirApi + Endpoints.ActivateRestaurantPaymentMethod,
      {paymentMethodId: id},
      {headers: {token: token.Result}},
    );
    const deactiveRequest = this.httpService.post<any>(
      process.env.GetirApi + Endpoints.InactivateRestaurantPaymentMethod,
      {paymentMethodId: id},
      {headers: {token: token.Result}},
    );
    const activateDeactivateResponse = active
      ? await activeRequest.toPromise()
      : await deactiveRequest.toPromise();

    const result = activateDeactivateResponse.data.result;
    if (result) {
      return <UIResponseBase<any>>{
        data: activateDeactivateResponse.data,
        totalCount: activateDeactivateResponse.data.length,
        IsError: false,
        StatusCode: 200,
      };
    } else {
      return <UIResponseBase<any>>{
        data: [],
        totalCount: 0,
        IsError: false,
        StatusCode: 200,
      };
    }
  }

  async ActivateDeactivateProductStatus(merchantId: number, body) {
    const {productId, status} = body as {productId; status};
    const token = await GetirToken.getToken(merchantId);
    const updateProductStatusRequest = await this.httpService
      .put<any>(
        process.env.GetirApi +
          Endpoints.updateProductStatus.replace('{productId}', productId),
        {status: status},
        {headers: {token: token.Result}},
      )
      .toPromise();

    const result = updateProductStatusRequest.data.result;
    if (result) {
      return <UIResponseBase<any>>{
        data: updateProductStatusRequest.data,
        totalCount: updateProductStatusRequest.data.length,
        IsError: false,
        StatusCode: 200,
      };
    } else {
      return <UIResponseBase<any>>{
        data: [],
        totalCount: 0,
        IsError: false,
        StatusCode: 200,
      };
    }
  }

  // async ActivateDeactivateCategoryStatus(merchantId: number, body) {
  //     try {
  //         const { productId, status } = body as { productId, status };
  //         const token = await GetirToken.getToken(merchantId);

  //         const activeRequest = this.httpService.post<any>(process.env.GetirApi + Endpoints.ActiveProductCategory.replace("{categoryId}", productId), {}, { headers: { 'token': token.Result } });
  //         const deactiveRequest = this.httpService.post<any>(process.env.GetirApi + Endpoints.InActiveProductCategory.replace("{categoryId}", productId), {}, { headers: { 'token': token.Result } });
  //         const activateDeactivateResponse = status ? await activeRequest.toPromise() : await deactiveRequest.toPromise();

  //         const result = activateDeactivateResponse.data['result'];
  //         if (result)
  //             return <UIResponseBase<any>>{ data: activateDeactivateResponse.data, totalCount: activateDeactivateResponse.data.length, IsError: false, StatusCode: 200 }
  //         else
  //             return <UIResponseBase<any>>{ data: [], totalCount: 0, IsError: false, StatusCode: 200 }
  //     } catch (e) {
  //         return <UIResponseBase<any>>{ IsError: true, MessageKey: (e as Error).message }
  //     }

  // }

  async AddPaymentMethod(merchantId: number, values: string) {
    const {id} = JSON.parse(values) as {id};
    const token = await GetirToken.getToken(merchantId);

    const restaurantAddPaymentMethods = await this.httpService
      .post<any>(
        process.env.GetirApi + Endpoints.AddRestaurantPaymentMethod,
        {paymentMethodId: id},
        {headers: {token: token.Result}},
      )
      .toPromise();

    const result = restaurantAddPaymentMethods.data.result;
    if (result) {
      return <UIResponseBase<any>>{
        data: restaurantAddPaymentMethods.data,
        totalCount: restaurantAddPaymentMethods.data.length,
        IsError: false,
        StatusCode: 200,
      };
    } else {
      return <UIResponseBase<any>>{
        data: [],
        totalCount: 0,
        IsError: false,
        StatusCode: 200,
      };
    }
  }

  async DeleteRestaurantPaymentMethods(
    merchantId: number,
    paymentMethodId: number,
  ) {
    const token = await GetirToken.getToken(merchantId);
    const restaurantPaymentMethods = await this.httpService
      .delete<any[]>(
        process.env.GetirApi + Endpoints.DeleteRestaurantPaymentMethod,
        {
          data: {paymentMethodId: paymentMethodId},
          headers: {token: token.Result},
        },
      )
      .toPromise();

    return <UIResponseBase<any>>{
      data: restaurantPaymentMethods.data,
      totalCount: restaurantPaymentMethods.data.length,
      IsError: false,
      StatusCode: 200,
    };
  }

  async GetAllPaymentMethods(merchantId: number) {
    const token = await GetirToken.getToken(merchantId);
    const availablePaymentMethods = await this.httpService
      .get<any[]>(process.env.GetirApi + Endpoints.listPaymentMethods, {
        headers: {token: token.Result},
      })
      .toPromise();

    return <UIResponseBase<any>>{
      data: availablePaymentMethods.data,
      totalCount: availablePaymentMethods.data.length,
      IsError: false,
      StatusCode: 200,
    };
  }

  async GetRestaurantDetails(merchantId: number) {
    const token = await GetirToken.getToken(merchantId);
    const restaurantInformation = await this.httpService
      .get<any>(process.env.GetirApi + Endpoints.GetRestaurantInformation, {
        headers: {token: token.Result},
      })
      .toPromise();
    restaurantInformation.data.status =
      restaurantInformation.data.status === 100;
    return <UIResponseBase<any>>{
      Result: restaurantInformation.data,
      IsError: false,
      StatusCode: 200,
    };
  }

  async GetRestaurantMenusAndOptions(merchantId: number) {
    const token = await GetirToken.getToken(merchantId);
    const restaurantMenusAndOptions = await this.httpService
      .get<any>(process.env.GetirApi + Endpoints.GetRestaurantMenuAndOptions, {
        headers: {token: token.Result},
      })
      .toPromise();
    // let responseData: RestaurantMenusAndOptionsType[] = [];

    // restaurantMenusAndOptions.data.productCategories.map(menueAndOptions => {
    //     responseData.push({
    //         id: menueAndOptions.id,
    //         key: menueAndOptions.name.tr,
    //         isApproved: menueAndOptions.isApproved,
    //         status: 0,
    //         weight: 0,
    //         items: menueAndOptions.products,
    //         count: menueAndOptions.products.length,
    //         groupCount: restaurantMenusAndOptions.data.productCategories.length
    //     });
    // });
    return <UIResponseBase<any>>{
      data: restaurantMenusAndOptions.data.productCategories,
      totalCount: restaurantMenusAndOptions.data.productCategories.length,
      IsError: false,
      StatusCode: 200,
      MessageKey: '',
    };
  }

  async GetOptionProdcuts(merchantId: number) {
    const token = await GetirToken.getToken(merchantId);
    const optionProducts = await this.httpService
      .get<any>(process.env.GetirApi + Endpoints.GetRestaurantOptionProducts, {
        headers: {token: token.Result},
      })
      .toPromise();
    return <UIResponseBase<any>>{
      data: optionProducts.data,
      totalCount: optionProducts.data.length,
      IsError: false,
      StatusCode: 200,
      MessageKey: '',
    };
  }

  async ActivateDeactivateOptionProduct(merchantId: number, body) {
    try {
      const {optionProductId, status} = body as {optionProductId; status};
      const token = await GetirToken.getToken(merchantId);
      const activeRequest = this.httpService.post<any>(
        process.env.GetirApi +
          Endpoints.activateRestaurantOptionsWithOptionProductId.replace(
            '{optionProductId}',
            optionProductId,
          ),
        {},
        {headers: {token: token.Result}},
      );
      const inactiveRequest = this.httpService.post<any>(
        process.env.GetirApi +
          Endpoints.inactivateRestaurantOptionsWithOptionProductId.replace(
            '{optionProductId}',
            optionProductId,
          ),
        {},
        {headers: {token: token.Result}},
      );
      const activateDeactivateResponse =
        status === 100
          ? await activeRequest.toPromise()
          : await inactiveRequest.toPromise();

      const result = activateDeactivateResponse.data.result;
      if (result) {
        return <UIResponseBase<any>>{
          data: activateDeactivateResponse.data,
          totalCount: activateDeactivateResponse.data.length,
          IsError: false,
          StatusCode: 200,
        };
      } else {
        return <UIResponseBase<any>>{
          data: [],
          totalCount: 0,
          IsError: false,
          StatusCode: 200,
        };
      }
    } catch (e) {
      console.log(e);
    }
  }

  async UpdateRestaurantAndCourierInfo(
    merchantId: number,
    body: {
      status: boolean;
      averagePreparationTime: number;
      isCourierAvailable: boolean;
    },
  ) {
    const token = await GetirToken.getToken(merchantId);

    try {
      let RestaurantStatus;
      if (body.status) {
        RestaurantStatus = await this.httpService
          .put<any[]>(
            process.env.GetirApi + Endpoints.OpenTheRestaurant,
            {},
            {headers: {token: token.Result}},
          )
          .toPromise();
      } else {
        RestaurantStatus = await this.httpService
          .put<any[]>(
            process.env.GetirApi + Endpoints.CloseTheRestaurant,
            {},
            {headers: {token: token.Result}},
          )
          .toPromise();
      }

      let CourierResult;
      if (body.isCourierAvailable) {
        CourierResult = await this.httpService
          .post<any[]>(
            process.env.GetirApi + Endpoints.EnableTheCourierService,
            {},
            {headers: {token: token.Result}},
          )
          .toPromise();
      } else {
        CourierResult = await this.httpService
          .post<any[]>(
            process.env.GetirApi + Endpoints.DisableTheCourierService,
            {},
            {headers: {token: token.Result}},
          )
          .toPromise();
      }

      let averagePreparationTimeResult;
      if (body.averagePreparationTime > 0) {
        averagePreparationTimeResult = await this.httpService
          .put<any[]>(
            process.env.GetirApi +
              Endpoints.UpdateRestaurantAveragePreparationTime,
            {averagePreparationTime: body.averagePreparationTime},
            {headers: {token: token.Result}},
          )
          .toPromise();
      }

      return <UIResponseBase<any>>{
        Result: {
          ...CourierResult.data,
          ...RestaurantStatus.data,
          ...averagePreparationTimeResult.data,
        },
        IsError: false,
      };
    } catch (e) {
      return <UIResponseBase<any>>{
        IsError: true,
        MessageKey: (e as Error).message,
      };
    }
  }

  async ActivateInActiveProductsAsOptions(merchantId, body) {
    try {
      const token = await GetirToken.getToken(merchantId);
      const {productId, status} = body;

      let activateProduct;
      let inactivateProduct;
      if (status) {
        activateProduct = await this.httpService
          .post<any[]>(
            process.env.GetirApi +
              Endpoints.activeRestaurantOptionsWithProductId.replace(
                '{productId}',
                productId,
              ),
            {},
            {headers: {token: token.Result}},
          )
          .toPromise();
      } else {
        inactivateProduct = await this.httpService
          .post<any[]>(
            process.env.GetirApi +
              Endpoints.inactivateRestaurantOptionsWithProductId.replace(
                '{productId}',
                productId,
              ),
            {},
            {headers: {token: token.Result}},
          )
          .toPromise();
      }

      return <UIResponseBase<any>>{
        Result: {...activateProduct?.data, ...inactivateProduct?.data},
        IsError: false,
      };
    } catch (e) {
      return <UIResponseBase<any>>{
        IsError: true,
        MessageKey: (e as Error).message,
      };
    }
  }

  async ActivateInActiveOptionProducts(merchantId, body) {
    try {
      const token = await GetirToken.getToken(merchantId);
      const {optionProductId, status} = body;

      let activateOption;
      let inactivateOption;
      if (status) {
        activateOption = await this.httpService
          .post<any[]>(
            process.env.GetirApi +
              Endpoints.activateRestaurantOptionsWithOptionProductId.replace(
                '{optionProductId}',
                optionProductId,
              ),
            {},
            {headers: {token: token.Result}},
          )
          .toPromise();
      } else {
        inactivateOption = await this.httpService
          .post<any[]>(
            process.env.GetirApi +
              Endpoints.inactivateRestaurantOptionsWithOptionProductId.replace(
                '{optionProductId}',
                optionProductId,
              ),
            {},
            {headers: {token: token.Result}},
          )
          .toPromise();
      }

      return <UIResponseBase<any>>{
        Result: {...activateOption?.data, ...inactivateOption?.data},
        IsError: false,
      };
    } catch (e) {
      return <UIResponseBase<any>>{
        IsError: true,
        MessageKey: (e as Error).message,
      };
    }
  }

  // async ActivateDeactivateAltOptions(merchantId, body) {
  //     try {
  //         const token = await GetirToken.getToken(merchantId);
  //         const { optionProductId, optionCategoryId, optionId, status } = body;
  //         const result = await this.httpService.put<any[]>(process.env.GetirApi + Endpoints.UpdateOptionProductOptionStatus.replace("{optionProductId}", optionProductId).replace("{optionCategoryId}", optionCategoryId).replace("{optionId}", optionId), { status: status ? 100 : 200 }, { headers: { 'token': token.Result } }).toPromise();
  //         return <UIResponseBase<any>>{ Result: { ...result.data }, IsError: false };
  //     } catch (e) {
  //         return <UIResponseBase<any>>{ IsError: true, MessageKey: (e as Error).message }
  //     }
  // }

  async UpdateOptionStatusInSpecificProductAndCategory(merchantId, body) {
    try {
      const token = await GetirToken.getToken(merchantId);
      const {productId, optionCategoryId, optionId, status} = body;
      const result = await this.httpService
        .put<any[]>(
          process.env.GetirApi +
            Endpoints.updateProductOptionStatus
              .replace('{productId}', productId)
              .replace('{optionCategoryId}', optionCategoryId)
              .replace('{optionId}', optionId),
          {status: status ? 100 : 200},
          {headers: {token: token.Result}},
        )
        .toPromise();

      return <UIResponseBase<any>>{Result: {...result.data}, IsError: false};
    } catch (e) {
      return <UIResponseBase<any>>{
        IsError: true,
        MessageKey: (e as Error).message,
      };
    }
  }

  async OrderReceived(merchantId, orderDetails: FoodOrderDto) {
    const orderRepository = getRepository(Order);
    // console.log(JSON.stringify(orderDetails))
    const order: Order = {
      CreateDate: new Date(),
      Note: orderDetails.foodOrder.clientNote,
      OrderChannel: OrderChannel.Getir,
      OrderNo: orderDetails.foodOrder.id,
      OrderStatus: orderDetails.foodOrder.status,
      TotalPrice: orderDetails.foodOrder.totalPrice,
      customer: <Customer>{
        Address: '',
        Location: JSON.stringify(orderDetails.foodOrder.courier.location),
        CustomerChannel: OrderChannel.Getir,
        PhoneNumber: orderDetails.foodOrder.client.clientPhoneNumber,
        ContactPhoneNumber: orderDetails.foodOrder.client.contactPhoneNumber,
        FullName: orderDetails.foodOrder.client.name,
        TelegramId: null,
        TelegramUserName: null,
      },
      GetirOrder: <GetirOrderDetails>{
        id: orderDetails.foodOrder.id,
        status: orderDetails.foodOrder.status,
        isScheduled: orderDetails.foodOrder.isScheduled,
        confirmationId: orderDetails.foodOrder.confirmationId,
        clientId: orderDetails.foodOrder.client.id,
        clientName: orderDetails.foodOrder.client.name,
        clientContactPhoneNumber:
          orderDetails.foodOrder.client.contactPhoneNumber,
        clientPhoneNumber: orderDetails.foodOrder.client.clientPhoneNumber,
        clientDeliveryAddressId:
          orderDetails.foodOrder.client.deliveryAddress.id,
        clientDistrict: orderDetails.foodOrder.client.deliveryAddress.district,
        clientCity: orderDetails.foodOrder.client.deliveryAddress.city,
        clientDeliveryAddress:
          orderDetails.foodOrder.client.deliveryAddress.address,
        clientLocation: JSON.stringify(orderDetails.foodOrder.client.location),
        courierId: orderDetails.foodOrder.courier.id,
        courierStatus: orderDetails.foodOrder.courier.status,
        courierName: orderDetails.foodOrder.courier.name,
        courierLocation: JSON.stringify(
          orderDetails.foodOrder.courier.location,
        ),
        clientNote: orderDetails.foodOrder.clientNote,
        doNotKnock: orderDetails.foodOrder.doNotKnock,
        dropOffAtDoor: orderDetails.foodOrder.dropOffAtDoor,
        totalPrice: orderDetails.foodOrder.totalPrice,
        checkoutDate: orderDetails.foodOrder.checkoutDate,
        deliveryType: orderDetails.foodOrder.deliveryType,
        isEcoFriendly: orderDetails.foodOrder.isEcoFriendly,
        paymentMethodText: JSON.stringify(
          orderDetails.foodOrder.paymentMethodText,
        ),
        paymentMethodId: orderDetails.foodOrder.paymentMethod,
        restaurantId: orderDetails.foodOrder.restaurant.id,
        productDetails: JSON.stringify(orderDetails.foodOrder.products),
      },
    };
    // orderRepository.save(order)
  }

  async OrderCanceled(merchantId, body) {
    console.log(body);
  }

  // async CheckAndGetAccessToken(merchantId: number) {
  //     const merchant = await this.merchantRepository.findOne(merchantId);
  //     let token = '';
  //     if (merchant.GetirAccessToken) {
  //         const TokenLastCreated = merchant.GetirTokenLastCreated;
  //         const validityPeriod = parseInt(process.env.GetirAccessTokenLife);
  //         const afterLifeTime = dayjs(TokenLastCreated).add(validityPeriod, 'minutes').toDate();

  //         if (dayjs(afterLifeTime).isBefore(new Date())) {
  //             token = await this.getAndUpdateToken(merchant);
  //         } else {
  //             token = merchant.GetirAccessToken;
  //         }
  //     } else {
  //         token = await this.getAndUpdateToken(merchant);
  //     }
  //     if (!token) {
  //         return <UIResponseBase<string>>{ Result: token, IsError: true }
  //     } else {
  //         return <UIResponseBase<string>>{ Result: token, IsError: false }
  //     }

  // }

  // private async getAndUpdateToken(merchant: Merchant) {
  //     const response = await this.httpService.post(process.env.GetirApi + Endpoints.auth, { appSecretKey: merchant.GetirAppSecretKey, restaurantSecretKey: merchant.GetirRestaurantSecretKey }).toPromise();
  //     if (response.status == 200) {
  //         this.merchantRepository.update({ Id: merchant.Id }, { GetirAccessToken: response.data.token, GetirTokenLastCreated: new Date() })
  //         return response.data.token;
  //     }
  //     return null;
  // }
}
