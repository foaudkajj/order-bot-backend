import {Merchant} from 'src/DB/models/merchant';
import {EntityRepository, Repository} from 'typeorm';

@EntityRepository(Merchant)
export class MerchantRepository extends Repository<Merchant> {
  async getGetirToken(merchatId: number) {
    const merchant = await this.findOne(merchatId);
    if (merchant?.GetirAccessToken) {
      return merchant.GetirAccessToken;
    } else {
      return null;
    }
  }
}
