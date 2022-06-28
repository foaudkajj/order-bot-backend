import { Merchant } from 'src/db/models/merchant';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Merchant)
export class MerchantRepository extends Repository<Merchant> {
  async getGetirToken(merchatId: number) {
    const merchant = await this.findOne(merchatId);
    if (merchant?.getirAccessToken) {
      return merchant.getirAccessToken;
    } else {
      return null;
    }
  }

  async getMerchantIdByBotUserName(botUserName: string): Promise<Merchant> {
    return await this.findOne({ where: { botUserName: botUserName } });
  }
}
