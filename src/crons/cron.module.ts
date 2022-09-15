import {Module} from '@nestjs/common';
import {StorageBlobService} from 'src/services';
import {SharedModule} from 'src/shared.module';
import {BlobStorageCleanCron} from './blob-storage-clean.cron';

@Module({
  imports: [SharedModule],
  providers: [BlobStorageCleanCron, StorageBlobService],
})
export class CronModule {}
