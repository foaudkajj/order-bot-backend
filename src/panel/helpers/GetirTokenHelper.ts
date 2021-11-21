import { HttpService } from '@nestjs/common';
import dayjs from 'dayjs';
import { MerchantRepository } from 'src/bot/custom-repositories/MerchantRepository';
import { Merchant } from 'src/DB/models/Merchant';
import { getCustomRepository } from 'typeorm';
import { Endpoints } from '../controllers/entegrations-management/Getir/Getir-Enums/Endpoints';
import { UIResponseBase } from '../dtos/UIResponseBase';

export default class GetirToken {
  static async getToken (merchantId: number) {
    const merchantRepository = getCustomRepository(MerchantRepository);
    const merchant = await merchantRepository.findOne(merchantId);
    let token = '';
    if (merchant?.GetirAccessToken) {
      const TokenLastCreated = merchant.GetirTokenLastCreated;
      const validityPeriod = parseInt(process.env.GetirAccessTokenLife);
      const afterLifeTime = dayjs(TokenLastCreated)
        .add(validityPeriod, 'minutes')
        .toDate();

      if (dayjs(afterLifeTime).isBefore(new Date())) {
        token = await this.getAndUpdateToken(merchant);
      } else {
        token = merchant.GetirAccessToken;
      }
    } else {
      token = await this.getAndUpdateToken(merchant);
    }
    if (!token) {
      return <UIResponseBase<string>>{ Result: token, IsError: true };
    } else {
      return <UIResponseBase<string>>{ Result: token, IsError: false };
    }
  }

  private static async getAndUpdateToken (merchant: Merchant) {
    const httpService = new HttpService();
    const response = await httpService
      .post(process.env.GetirApi + Endpoints.auth, {
        appSecretKey: merchant.GetirAppSecretKey,
        restaurantSecretKey: merchant.GetirRestaurantSecretKey
      })
      .toPromise();
    if (response.status == 200) {
      const merchantRepository = getCustomRepository(MerchantRepository);
      merchantRepository.update(
        { Id: merchant.Id },
        {
          GetirAccessToken: response.data.token,
          GetirTokenLastCreated: new Date()
        }
      );
      return response.data.token;
    }
    return null;
  }
}
