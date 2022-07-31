import {HttpService} from '@nestjs/axios';
import {Injectable} from '@nestjs/common';
import dayjs from 'dayjs';
import {MerchantRepository} from 'src/bot/repositories/merchant.repository';
import {Merchant} from 'src/db/models/merchant';
import {Endpoints} from '../controllers/entegrations-management/getir/getir.enums';
import {UIResponseBase} from '../dtos/ui-response-base';

@Injectable()
export default class GetirTokenService {
  constructor(private merchantRepository: MerchantRepository) {}
  async getToken(merchantId: number) {
    const merchant = await this.merchantRepository.orm.findOne({
      where: {id: merchantId},
    });
    let token = '';
    if (merchant?.getirAccessToken) {
      const TokenLastCreated = merchant.getirTokenLastCreated;
      const validityPeriod = parseInt(process.env.GetirAccessTokenLife);
      const afterLifeTime = dayjs(TokenLastCreated)
        .add(validityPeriod, 'minutes')
        .toDate();

      if (dayjs(afterLifeTime).isBefore(new Date())) {
        token = await this.getAndUpdateToken(merchant);
      } else {
        token = merchant.getirAccessToken;
      }
    } else {
      token = await this.getAndUpdateToken(merchant);
    }
    if (!token) {
      return <UIResponseBase<string>>{result: token, isError: true};
    } else {
      return <UIResponseBase<string>>{result: token, isError: false};
    }
  }

  private async getAndUpdateToken(merchant: Merchant) {
    const httpService = new HttpService();
    const response = await httpService
      .post(process.env.GetirApi + Endpoints.auth, {
        appSecretKey: merchant.getirAppSecretKey,
        restaurantSecretKey: merchant.getirRestaurantSecretKey,
      })
      .toPromise();
    if (response.status === 200) {
      this.merchantRepository.orm.update(
        {id: merchant.id},
        {
          getirAccessToken: response.data.token,
          getirTokenLastCreated: new Date(),
        },
      );
      return response.data.token;
    }
    return null;
  }
}
