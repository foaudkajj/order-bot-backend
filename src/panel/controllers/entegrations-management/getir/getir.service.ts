import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {MerchantRepository} from 'src/db/repositories/merchant.repository';
import {UIResponseBase} from 'src/panel/dtos/ui-response-base';
import {In} from 'typeorm';
import GetirTokenService from 'src/panel/helpers/getir-token-helper';
import {GetirOrder} from 'src/models/getir-order';
import {Order} from 'src/models/order';
import {FoodOrderDto} from './getir-dtos/food-order-dto';
import {Customer} from 'src/models/customer';
import {
  Category,
  Option,
  OrderChannel,
  OrderItem,
  OrderStatus,
  PaymentMethod,
  Product,
  ProductStatus,
} from 'src/models';
import {GetirOrderStatus, Endpoints, GetirResult} from './getir.enums';
import {ProductCategory} from './getir-dtos/restaurant-menu';
import {firstValueFrom} from 'rxjs';
import {OptionCategory} from 'src/models/option-category';
import {OrderOption} from 'src/models/order-option';
import {HttpService} from '@nestjs/axios';
import {
  CategoryRepository,
  OptionCategoryRepository,
  OptionRepository,
  OrderRepository,
  ProductRepository,
} from 'src/db/repositories';
import {DevextremeService} from 'src/services/devextreme.service';

@Injectable()
export class GetirService {
  GetirAppSecretKey: string;
  GetirRestaurantSecretKey: string;
  constructor(
    public devextremeLoadOptions: DevextremeService,
    public httpService: HttpService,
    private orderRepository: OrderRepository,
    private merchantRepository: MerchantRepository,
    private categoryRepository: CategoryRepository,
    private productRepository: ProductRepository,
    private optionCategoryRepository: OptionCategoryRepository,
    private optionRepository: OptionRepository,
    private getirToken: GetirTokenService,
  ) {}

  // async AddOrDeletePaymentMethod(merchantId, body) {
  //     const token = await this.getirToken.getToken(merchantId);
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
  //     const token = await this.getirToken.getToken(merchantId);
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
    const token = await this.getirToken.getToken(merchantId);
    const restaurantPaymentMethods = await this.httpService
      .get<
        any[]
      >(process.env.GetirApi + Endpoints.GetRestaurantPaymentMethods, {headers: {token: token.data}})
      .toPromise();

    return <UIResponseBase<any>>{
      data: restaurantPaymentMethods.data,
      totalCount: restaurantPaymentMethods.data.length,
    };
  }

  async ActivateDeactivateRestaurantPaymentMethods(merchantId: number, body) {
    const {id, active} = body as {id; active};
    const token = await this.getirToken.getToken(merchantId);

    const activeRequest = this.httpService.post<any>(
      process.env.GetirApi + Endpoints.ActivateRestaurantPaymentMethod,
      {paymentMethodId: id},
      {headers: {token: token.data}},
    );
    const deactiveRequest = this.httpService.post<any>(
      process.env.GetirApi + Endpoints.InactivateRestaurantPaymentMethod,
      {paymentMethodId: id},
      {headers: {token: token.data}},
    );
    const activateDeactivateResponse = active
      ? await activeRequest.toPromise()
      : await deactiveRequest.toPromise();

    const result = activateDeactivateResponse.data.result;
    if (result) {
      return <UIResponseBase<any>>{
        data: activateDeactivateResponse.data,
        totalCount: activateDeactivateResponse.data.length,
      };
    } else {
      return <UIResponseBase<any>>{
        data: [],
        totalCount: 0,
      };
    }
  }

  async ActivateDeactivateProductStatus(merchantId: number, body) {
    const {productId, status} = body as {productId; status};
    const token = await this.getirToken.getToken(merchantId);
    const updateProductStatusRequest = await this.httpService
      .put<any>(
        process.env.GetirApi +
          Endpoints.updateProductStatus.replace('{productId}', productId),
        {status: status},
        {headers: {token: token.data}},
      )
      .toPromise();

    const result = updateProductStatusRequest.data.result;
    if (result) {
      return <UIResponseBase<any>>{
        data: updateProductStatusRequest.data,
        totalCount: updateProductStatusRequest.data.length,
      };
    } else {
      return <UIResponseBase<any>>{
        data: [],
        totalCount: 0,
      };
    }
  }

  // async ActivateDeactivateCategoryStatus(merchantId: number, body) {
  //     try {
  //         const { productId, status } = body as { productId, status };
  //         const token = await this.getirToken.getToken(merchantId);

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
    const token = await this.getirToken.getToken(merchantId);

    const restaurantAddPaymentMethods = await this.httpService
      .post<any>(
        process.env.GetirApi + Endpoints.AddRestaurantPaymentMethod,
        {paymentMethodId: id},
        {headers: {token: token.data}},
      )
      .toPromise();

    const result = restaurantAddPaymentMethods.data.result;
    if (result) {
      return <UIResponseBase<any>>{
        data: restaurantAddPaymentMethods.data,
        totalCount: restaurantAddPaymentMethods.data.length,
      };
    } else {
      return <UIResponseBase<any>>{
        data: [],
        totalCount: 0,
      };
    }
  }

  async DeleteRestaurantPaymentMethods(
    merchantId: number,
    paymentMethodId: number,
  ) {
    const token = await this.getirToken.getToken(merchantId);
    const restaurantPaymentMethods = await this.httpService
      .delete<any[]>(
        process.env.GetirApi + Endpoints.DeleteRestaurantPaymentMethod,
        {
          data: {paymentMethodId: paymentMethodId},
          headers: {token: token.data},
        },
      )
      .toPromise();

    return <UIResponseBase<any>>{
      data: restaurantPaymentMethods.data,
      totalCount: restaurantPaymentMethods.data.length,
    };
  }

  async GetAllPaymentMethods(merchantId: number) {
    const token = await this.getirToken.getToken(merchantId);
    const availablePaymentMethods = await this.httpService
      .get<any[]>(process.env.GetirApi + Endpoints.listPaymentMethods, {
        headers: {token: token.data},
      })
      .toPromise();

    return <UIResponseBase<any>>{
      data: availablePaymentMethods.data,
      totalCount: availablePaymentMethods.data.length,
    };
  }

  async GetRestaurantDetails(merchantId: number) {
    const token = await this.getirToken.getToken(merchantId);
    const restaurantInformation = await this.httpService
      .get<any>(process.env.GetirApi + Endpoints.GetRestaurantInformation, {
        headers: {token: token.data},
      })
      .toPromise();
    restaurantInformation.data.status =
      restaurantInformation.data.status === 100;
    return <UIResponseBase<any>>{
      data: restaurantInformation.data,
    };
  }

  async GetRestaurantMenusAndOptions(merchantId: number) {
    const token = await this.getirToken.getToken(merchantId);
    const restaurantMenusAndOptions = await this.httpService
      .get<any>(process.env.GetirApi + Endpoints.GetRestaurantMenuAndOptions, {
        headers: {token: token.data},
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
    };
  }

  async GetOptionProdcuts(merchantId: number) {
    const token = await this.getirToken.getToken(merchantId);
    const optionProducts = await this.httpService
      .get<any>(process.env.GetirApi + Endpoints.GetRestaurantOptionProducts, {
        headers: {token: token.data},
      })
      .toPromise();
    return <UIResponseBase<any>>{
      data: optionProducts.data,
      totalCount: optionProducts.data.length,
    };
  }

  async ActivateDeactivateOptionProduct(merchantId: number, body) {
    try {
      const {optionProductId, status} = body as {optionProductId; status};
      const token = await this.getirToken.getToken(merchantId);
      const activeRequest = this.httpService.post<any>(
        process.env.GetirApi +
          Endpoints.activateRestaurantOptionsWithOptionProductId.replace(
            '{optionProductId}',
            optionProductId,
          ),
        {},
        {headers: {token: token.data}},
      );
      const inactiveRequest = this.httpService.post<any>(
        process.env.GetirApi +
          Endpoints.inactivateRestaurantOptionsWithOptionProductId.replace(
            '{optionProductId}',
            optionProductId,
          ),
        {},
        {headers: {token: token.data}},
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
        };
      } else {
        return <UIResponseBase<any>>{
          data: [],
          totalCount: 0,
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
    const token = await this.getirToken.getToken(merchantId);

    try {
      let RestaurantStatus;
      if (body.status) {
        RestaurantStatus = await this.httpService
          .put<
            any[]
          >(process.env.GetirApi + Endpoints.OpenTheRestaurant, {}, {headers: {token: token.data}})
          .toPromise();
      } else {
        RestaurantStatus = await this.httpService
          .put<
            any[]
          >(process.env.GetirApi + Endpoints.CloseTheRestaurant, {}, {headers: {token: token.data}})
          .toPromise();
      }

      let CourierResult;
      if (body.isCourierAvailable) {
        CourierResult = await this.httpService
          .post<
            any[]
          >(process.env.GetirApi + Endpoints.EnableTheCourierService, {}, {headers: {token: token.data}})
          .toPromise();
      } else {
        CourierResult = await this.httpService
          .post<
            any[]
          >(process.env.GetirApi + Endpoints.DisableTheCourierService, {}, {headers: {token: token.data}})
          .toPromise();
      }

      let averagePreparationTimeResult;
      if (body.averagePreparationTime > 0) {
        averagePreparationTimeResult = await this.httpService
          .put<
            any[]
          >(process.env.GetirApi + Endpoints.UpdateRestaurantAveragePreparationTime, {averagePreparationTime: body.averagePreparationTime}, {headers: {token: token.data}})
          .toPromise();
      }

      return <UIResponseBase<any>>{
        data: {
          ...CourierResult.data,
          ...RestaurantStatus.data,
          ...averagePreparationTimeResult.data,
        },
      };
    } catch (e) {
      throw new HttpException(
        <GetirResult>{
          code: e?.response?.data?.code,
          detail: e?.response?.data?.detail,
          error: e?.response?.data?.error,
          message: e?.response?.data?.message,
          result: false,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async ActivateInActiveProductsAsOptions(merchantId, body) {
    try {
      const token = await this.getirToken.getToken(merchantId);
      const {productId, status} = body;

      let activateProduct;
      let inactivateProduct;
      if (status) {
        activateProduct = await this.httpService
          .post<
            any[]
          >(process.env.GetirApi + Endpoints.activeRestaurantOptionsWithProductId.replace('{productId}', productId), {}, {headers: {token: token.data}})
          .toPromise();
      } else {
        inactivateProduct = await this.httpService
          .post<
            any[]
          >(process.env.GetirApi + Endpoints.inactivateRestaurantOptionsWithProductId.replace('{productId}', productId), {}, {headers: {token: token.data}})
          .toPromise();
      }

      return <UIResponseBase<any>>{
        data: {...activateProduct?.data, ...inactivateProduct?.data},
      };
    } catch (e) {
      throw new HttpException(
        (e as Error).message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async ActivateInActiveOptionProducts(merchantId, body) {
    try {
      const token = await this.getirToken.getToken(merchantId);
      const {optionProductId, status} = body;

      let activateOption;
      let inactivateOption;
      if (status) {
        activateOption = await this.httpService
          .post<
            any[]
          >(process.env.GetirApi + Endpoints.activateRestaurantOptionsWithOptionProductId.replace('{optionProductId}', optionProductId), {}, {headers: {token: token.data}})
          .toPromise();
      } else {
        inactivateOption = await this.httpService
          .post<
            any[]
          >(process.env.GetirApi + Endpoints.inactivateRestaurantOptionsWithOptionProductId.replace('{optionProductId}', optionProductId), {}, {headers: {token: token.data}})
          .toPromise();
      }

      return <UIResponseBase<any>>{
        data: {...activateOption?.data, ...inactivateOption?.data},
      };
    } catch (e) {
      throw new HttpException(
        (e as Error).message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // async ActivateDeactivateAltOptions(merchantId, body) {
  //     try {
  //         const token = await this.getirToken.getToken(merchantId);
  //         const { optionProductId, optionCategoryId, optionId, status } = body;
  //         const result = await this.httpService.put<any[]>(process.env.GetirApi + Endpoints.UpdateOptionProductOptionStatus.replace("{optionProductId}", optionProductId).replace("{optionCategoryId}", optionCategoryId).replace("{optionId}", optionId), { status: status ? 100 : 200 }, { headers: { 'token': token.Result } }).toPromise();
  //         return <UIResponseBase<any>>{ Result: { ...result.data }, IsError: false };
  //     } catch (e) {
  //         return <UIResponseBase<any>>{ IsError: true, MessageKey: (e as Error).message }
  //     }
  // }

  async UpdateOptionStatusInSpecificProductAndCategory(merchantId, body) {
    try {
      const token = await this.getirToken.getToken(merchantId);
      const {productId, optionCategoryId, optionId, status} = body;
      const result = await this.httpService
        .put<
          any[]
        >(process.env.GetirApi + Endpoints.updateProductOptionStatus.replace('{productId}', productId).replace('{optionCategoryId}', optionCategoryId).replace('{optionId}', optionId), {status: status ? 100 : 200}, {headers: {token: token.data}})
        .toPromise();

      return <UIResponseBase<any>>{data: {...result.data}, isError: false};
    } catch (e) {
      throw new HttpException(
        (e as Error).message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async OrderReceived(orderDetails: FoodOrderDto) {
    const existingOrder = await this.orderRepository.orm.findOne({
      where: {getirOrderId: orderDetails.foodOrder.id},
    });

    if (existingOrder) {
      await this.orderRepository.orm.update(
        {id: existingOrder.id},
        {orderStatus: OrderStatus.New},
      );
    } else {
      const merchant = await this.merchantRepository.orm.findOne({
        where: {getirRestaurantId: orderDetails.foodOrder.restaurant.id},
      });

      let optionList = await this.optionRepository.orm.find({
        select: ['id', 'getirOptionId'],
      });

      const getirProductList = orderDetails.foodOrder.products;
      const productOptionListMap: Map<
        string,
        {optionId: string; price: number}[]
      > = new Map<string, {optionId: string; price: number}[]>();
      for (const getirProduct of getirProductList) {
        const tempOptionList: {optionId: string; price: number}[] = [];
        for (const optionCategory of getirProduct?.optionCategories) {
          const options = optionCategory.options.map(
            m =>
              <{optionId: string; price: number}>{
                optionId: m.option,
                price: m.price,
              },
          );
          tempOptionList.push(...options);
        }

        const notExistingOptions = tempOptionList
          .map(m => m.optionId)
          .filter(fi => !optionList.map(mm => mm.getirOptionId).includes(fi));

        if (notExistingOptions.length > 0) {
          try {
            await this.importUpdateGetirProducts(merchant.id);
            optionList = await this.optionRepository.orm.find({
              select: ['id', 'getirOptionId'],
            });
          } catch (e) {}
        }

        productOptionListMap.set(getirProduct.product, tempOptionList);
      }

      const products = await this.productRepository.orm.find({
        where: {getirProductId: In(getirProductList.map(pr => pr.product))},
      });

      const order: Order = {
        merchantId: merchant.id,
        createDate: new Date(),
        note: orderDetails.foodOrder.clientNote,
        orderChannel: OrderChannel.Getir,
        orderNo: orderDetails.foodOrder.id,
        orderStatus: this.getUserStatus(orderDetails.foodOrder.status),
        totalPrice: orderDetails.foodOrder.totalPrice,
        paymentMethod:
          orderDetails.foodOrder.paymentMethod === 4
            ? PaymentMethod.OnDelivery
            : PaymentMethod.Online,
        customer: <Customer>{
          merchantId: merchant.id,
          Address: `${orderDetails.foodOrder.client.deliveryAddress.address} ${orderDetails.foodOrder.client.deliveryAddress.district}/${orderDetails.foodOrder.client.deliveryAddress.city}`,
          location: JSON.stringify(orderDetails.foodOrder.courier.location),
          customerChannel: OrderChannel.Getir,
          phoneNumber: orderDetails.foodOrder.client.clientPhoneNumber,
          ContactPhoneNumber: orderDetails.foodOrder.client.contactPhoneNumber,
          fullName: orderDetails.foodOrder.client.name,
          telegramId: null,
          telegramUserName: null,
          address: orderDetails.foodOrder.client.deliveryAddress.address,
          createDate: new Date(),
        },
        getirOrder: <GetirOrder>{
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
          clientDistrict:
            orderDetails.foodOrder.client.deliveryAddress.district,
          clientCity: orderDetails.foodOrder.client.deliveryAddress.city,
          clientDeliveryAddress:
            orderDetails.foodOrder.client.deliveryAddress.address,
          clientLocation: JSON.stringify(
            orderDetails.foodOrder.client.location,
          ),
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
        },
      };
      const createdOrder = await this.orderRepository.orm.save(order);
      createdOrder.orderItems = getirProductList.map(
        pp =>
          <OrderItem>{
            orderId: createdOrder.id,
            productId: products.find(f => f.getirProductId === pp.product).id,
            productStatus: ProductStatus.InBasket,
            amount: pp.count,
            itemNote: pp.note,
            orderOptions: productOptionListMap.get(pp.product).map(
              m =>
                <OrderOption>{
                  optionId: optionList.find(f => f.getirOptionId === m.optionId)
                    .id,
                  price: m.price,
                },
            ),
          },
      );
      await this.orderRepository.orm.save(createdOrder);
    }
  }

  async OrderCanceled(body) {
    // const merchant = await this.merchantRepository.findOne({
    //   where: {GetirRestaurantId: orderDetails.foodOrder.restaurant.id},
    // });
    console.log(body);
  }

  async importUpdateGetirProducts(merchantId: number) {
    const restaurantDetails: UIResponseBase<ProductCategory[]> =
      await this.GetRestaurantMenusAndOptions(merchantId);

    const getirCategoryList = restaurantDetails.data.map(
      category => category.id,
    );

    const categoryList = await this.categoryRepository.orm.find({
      where: {getirCategoryId: In(getirCategoryList)},
    });

    const getirProductIdList = restaurantDetails.data
      .map(m => m.products)
      .reduce((prev, curr) => prev.concat(curr))
      .map(m => m.id);

    const productList = await this.productRepository.orm.find({
      where: {getirProductId: In(getirProductIdList)},
    });

    const getirOptionCategotyIdList: string[] = [];
    const getirOptionIdList: string[] = [];
    restaurantDetails.data
      .map(m => m.products)
      .forEach(productList => {
        productList.forEach(product => {
          const optionCategoryIdList = product.optionCategories.map(
            oc => oc.id,
          );
          if (optionCategoryIdList.length > 0) {
            getirOptionCategotyIdList.push(...optionCategoryIdList);
          }

          product.optionCategories.forEach(opcat => {
            const optionIdList = opcat.options.map(op => op.id);
            if (optionIdList.length > 0) {
              getirOptionIdList.push(...optionIdList);
            }
          });
        });
      });

    const optionCategoryList = getirOptionCategotyIdList
      ? await this.optionCategoryRepository.orm.find({
          where: {getirOptionCategoryId: In(getirOptionCategotyIdList)},
        })
      : [];

    const optionList = getirOptionIdList
      ? await this.optionRepository.orm.find({
          where: {getirOptionId: In(getirOptionIdList)},
        })
      : [];

    for await (const productCategory of restaurantDetails.data) {
      let fetchedCategory: Category;
      const getirCategory: Category = {
        name: productCategory.name.tr,
        getirCategoryId: productCategory.id,
        merchantId: merchantId,
        categoryKey: productCategory.name.tr
          .trim()
          .replace(' ', '')
          .toUpperCase(),
      };
      if (
        categoryList.map(c => c.getirCategoryId).includes(productCategory.id)
      ) {
        getirCategory.categoryKey =
          categoryList.find(fi => fi.getirCategoryId === productCategory.id)
            ?.categoryKey ?? getirCategory.categoryKey;
        await this.categoryRepository.orm.update(
          {getirCategoryId: productCategory.id},
          getirCategory,
        );

        fetchedCategory = categoryList.find(
          fi => fi.getirCategoryId === productCategory.id,
        );
      } else {
        fetchedCategory = await this.categoryRepository.orm.save(getirCategory);
      }

      for await (const getirProduct of productCategory.products) {
        let productId: number;
        const newGetirProduct: Product = {
          title: getirProduct.name.tr,
          description: getirProduct.description.tr,
          unitPrice: getirProduct.price,
          categoryId: fetchedCategory.id,
          thumbUrl: getirProduct.imageURL,
          getirProductId: getirProduct.id,
          merchantId: merchantId,
        };
        if (productList.map(m => m.getirProductId).includes(getirProduct.id)) {
          productId = productList.find(
            fi => fi.getirProductId === getirProduct.id,
          )?.id;
          await this.productRepository.orm.update(
            {getirProductId: getirProduct.id},
            newGetirProduct,
          );
        } else {
          const craetedProduct =
            await this.productRepository.orm.save(newGetirProduct);
          productId = craetedProduct.id;
        }

        for await (const optionCategory of getirProduct.optionCategories) {
          const newOptionCategory: OptionCategory = {
            name: optionCategory.name.tr,
            getirOptionCategoryId: optionCategory.id,
          };

          let optionCategoryId: number;
          if (
            optionCategoryList
              .map(mp => mp.getirOptionCategoryId)
              .includes(optionCategory.id)
          ) {
            await this.optionCategoryRepository.orm.update(
              {getirOptionCategoryId: optionCategory.id},
              newOptionCategory,
            );
            optionCategoryId = optionCategoryList.find(
              mp => mp.getirOptionCategoryId,
            ).id;
          } else {
            const createdCategory =
              await this.optionCategoryRepository.orm.save(newOptionCategory);
            optionCategoryId = createdCategory.id;
          }

          for await (const option of optionCategory.options) {
            const newOption: Option = {
              name: option.name.tr,
              getirOptionId: option.id,
              optionCategoryId: optionCategoryId,
              price: option.price,
              // getirProductId: option.product,
            };

            if (optionList.map(mp => mp.getirOptionId).includes(option.id)) {
              await this.optionRepository.orm.update(
                {getirOptionId: option.id},
                newOption,
              );
            } else {
              await this.optionRepository.orm.save(newOption);
            }
          }
        }
      }
    }
  }

  async verifyOrder(foodOrderId: string, merchantId: number) {
    const token = await this.getirToken.getToken(merchantId);

    try {
      const response = await firstValueFrom(
        this.httpService.post<GetirResult>(
          process.env.GetirApi +
            Endpoints.verifyFoodOrder.replace('{foodOrderId}', foodOrderId),
          {},
          {headers: {token: token.data}},
        ),
      );
      return response?.data;
    } catch (e) {
      return <GetirResult>{
        code: e?.response?.data?.code,
        detail: e?.response?.data?.detail,
        error: e?.response?.data?.error,
        message: e?.response?.data?.message,
        result: false,
      };
    }
  }

  async verifyFutureOrder(foodOrderId: string, merchantId: number) {
    const token = await this.getirToken.getToken(merchantId);

    try {
      const response = await firstValueFrom(
        this.httpService.post<GetirResult>(
          process.env.GetirApi +
            Endpoints.verifyScheduledFoodOrder.replace(
              '{foodOrderId}',
              foodOrderId,
            ),
          {},
          {headers: {token: token.data}},
        ),
      );

      return response?.data;
    } catch (e) {
      return <GetirResult>{
        code: e?.response?.data?.code,
        detail: e?.response?.data?.detail,
        error: e?.response?.data?.error,
        message: e?.response?.data?.message,
        result: false,
      };
    }
  }

  async prepareOrder(foodOrderId: string, merchantId: number) {
    const token = await this.getirToken.getToken(merchantId);

    try {
      const response = await firstValueFrom(
        this.httpService.post<GetirResult>(
          process.env.GetirApi +
            Endpoints.prepareFoodOrder.replace('{foodOrderId}', foodOrderId),
          {},
          {headers: {token: token.data}},
        ),
      );
      return response?.data;
    } catch (e) {
      return <GetirResult>{
        code: e?.response?.data?.code,
        detail: e?.response?.data?.detail,
        error: e?.response?.data?.error,
        message: e?.response?.data?.message,
        result: false,
      };
    }
  }

  async deliverOrder(foodOrderId: string, merchantId: number) {
    const token = await this.getirToken.getToken(merchantId);

    try {
      const response = await firstValueFrom(
        this.httpService.post<GetirResult>(
          process.env.GetirApi +
            Endpoints.deliverFoodOrder.replace('{foodOrderId}', foodOrderId),
          {},
          {headers: {token: token.data}},
        ),
      );

      return response?.data;
    } catch (e) {
      return <GetirResult>{
        code: e?.response?.data?.code,
        detail: e?.response?.data?.detail,
        error: e?.response?.data?.error,
        message: e?.response?.data?.message,
        result: false,
      };
    }
  }

  async handoverOrder(foodOrderId: string, merchantId: number) {
    const token = await this.getirToken.getToken(merchantId);

    try {
      const result = await firstValueFrom(
        this.httpService.post<GetirResult>(
          process.env.GetirApi +
            Endpoints.handoverFoodOrder.replace('{foodOrderId}', foodOrderId),
          {},
          {headers: {token: token.data}},
        ),
      );
      return result?.data;
    } catch (e) {
      return <GetirResult>{
        code: e?.response?.data?.code,
        detail: e?.response?.data?.detail,
        error: e?.response?.data?.error,
        message: e?.response?.data?.message,
        result: false,
      };
    }
  }

  async cancelOrder(foodOrderId: string, merchantId: number) {
    const token = await this.getirToken.getToken(merchantId);

    try {
      const response = await firstValueFrom(
        this.httpService.post<GetirResult>(
          process.env.GetirApi +
            Endpoints.cancelFoodOrder.replace('{foodOrderId}', foodOrderId),
          {},
          {headers: {token: token.data}},
        ),
      );

      return response?.data;
    } catch (e) {
      return <GetirResult>{
        code: e?.response?.data?.code,
        detail: e?.response?.data?.detail,
        error: e?.response?.data?.error,
        message: e?.response?.data?.message,
        result: false,
      };
    }
  }

  private getUserStatus(orderStatus: GetirOrderStatus) {
    switch (orderStatus) {
      case GetirOrderStatus.RestaurantApprovalPending:
        return OrderStatus.UserConfirmed;

      case GetirOrderStatus.RestaurantApprovalPendingForScheduledOrder:
        return OrderStatus.FutureOrder;
    }
  }
}
