import {InjectRepository} from '@nestjs/typeorm';
import {Merchant} from 'src/models/merchant';
import {Repository} from 'typeorm';
import {BaseRepository} from './base.repository';

export class MerchantRepository extends BaseRepository<Merchant> {
  constructor(
    @InjectRepository(Merchant)
    private _: Repository<Merchant>,
  ) {
    super();
    this.orm = _;
  }

  async getGetirToken(merchatId: number) {
    const merchant = await this.orm.findOne({where: {id: merchatId}});
    if (merchant?.getirAccessToken) {
      return merchant.getirAccessToken;
    } else {
      return null;
    }
  }

  async getMerchantIdByBotUserName(botUserName: string): Promise<Merchant> {
    return this.orm.findOne({where: {botUserName: botUserName}});
  }
}
