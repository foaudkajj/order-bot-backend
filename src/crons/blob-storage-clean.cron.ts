import {Injectable, Logger} from '@nestjs/common';
import {Cron, CronExpression} from '@nestjs/schedule';
import {ProductRepository} from 'src/db/repositories';
import {StoragePrefix} from 'src/models';
import {StorageBlobService} from 'src/services';

/**
 * A Class to clean images not used product images.
 */
@Injectable()
export class BlobStorageCleanCron {
  private readonly logger = new Logger(BlobStorageCleanCron.name);

  constructor(
    private azureStorage: StorageBlobService,
    private productRepository: ProductRepository,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async handleCron() {
    console.log('started');
    try {
      const productList = await this.productRepository.orm.find({
        select: {thumbUrl: true},
      });
      const thumbUrlList = productList.map(m => m.thumbUrl);

      const thumbBlobList = await this.azureStorage.listBlobs(
        StoragePrefix.Products,
      );
      if (thumbBlobList?.length > 0) {
        const storageThumbUrlList: string[] = thumbBlobList.map(m => m.name);

        const obseleteThumbUrlList = storageThumbUrlList.filter(
          b =>
            !thumbUrlList.includes(b.replace(`${StoragePrefix.Products}/`, '')),
        );

        if (obseleteThumbUrlList.length > 0) {
          await this.azureStorage.bulkFileDelete(obseleteThumbUrlList);
        }
      }

      console.log('done');
    } catch (e) {
      console.log(e);
      this.logger.error(e);
    }
  }
}
