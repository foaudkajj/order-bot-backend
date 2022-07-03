import {BlobBatch, BlobServiceClient} from '@azure/storage-blob';
import {Injectable, Scope} from '@nestjs/common';
/**
 * @class StorageBlobService provides methods for data manipulation in
 * Azure blob storage.
 */
@Injectable({scope: Scope.DEFAULT})
export class StorageBlobService {
  private blobServiceClient;
  private containerClient;

  constructor() {
    this.blobServiceClient = BlobServiceClient.fromConnectionString(
      process.env.AZURE_STORAGE_CONNECTION_STRING ?? '',
    );
    this.containerClient = this.blobServiceClient.getContainerClient('photos');
  }

  /**
   * Performs a simple request on the blob storage requesting account information.
   * @returns {Promise<boolean>} true if succeeded; false otherwise
   */
  public async ping(): Promise<boolean> {
    const info = await this.blobServiceClient.getAccountInfo();
    return info?._response?.status === 200;
  }

  /**
   * Uploads file.
   * @param {string} fileName - file name
   * @param {Buffer} data - file data
   * @param {string} typePrefix - prefix of object type
   * @returns {Promise<string | undefined>} request id
   */
  private async uploadFile(
    fileName: string,
    data: Buffer,
    typePrefix: string,
    blobContentType: string,
  ) {
    const blockBlobClient = this.containerClient.getBlockBlobClient(
      `${typePrefix}/${fileName}`,
    );

    // Use the following code to upload file as chunks and get the uploading progress.
    // see https://stackoverflow.com/questions/64910728/azure-blob-storage-upload-file-with-progress
    // const readableStream = Readable.from(data);
    // const response = await blockBlobClient.uploadStream(
    //   readableStream,
    //   1024 * 1024,
    //   undefined,
    //   {
    //     blobHTTPHeaders: {blobContentType: blobContentType},
    //     onProgress: progress => {
    //       console.info(progress);
    //     },
    //   },
    // );

    const response = await blockBlobClient.uploadData(data, {
      blobHTTPHeaders: {blobContentType: blobContentType},
    });
    return Promise.resolve(response.requestId);
  }

  /**
   * Deletes file.
   * @param {string} fileName - file name
   * @returns
   * */
  async deleteFile(fileName: string): Promise<void> {
    const blockBlobClient = this.containerClient.getBlockBlobClient(fileName);
    await blockBlobClient.deleteIfExists();
  }

  async bulkFileDelete(fileNames: string[]) {
    if (fileNames.length > 0) {
      const blobBatchClient = this.blobServiceClient.getBlobBatchClient();
      const batchRequest = new BlobBatch();
      await Promise.all(
        fileNames.map(async (fileName, index) => {
          const blobClient = this.containerClient.getBlockBlobClient(fileName);
          if (index === 0) await batchRequest.deleteBlob(blobClient);
          else
            await batchRequest.deleteBlob(blobClient, {
              deleteSnapshots: 'include',
            });
        }),
      );
      await blobBatchClient.submitBatch(batchRequest);
    }
  }

  /**
   * Downloads file.
   * @param {string} blobName - blob name
   * @returns
   * */
  async downloadFile(blobName: string): Promise<Buffer | undefined> {
    try {
      const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);
      const fileBuffer = await blockBlobClient.downloadToBuffer();
      return fileBuffer;
    } catch (e) {
      return undefined;
    }
  }

  /**
   * Copies file.
   * @param {string} sourceBlobName - file id
   * @returns
   * */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async copyFile(sourceBlobName: string, targetBlobName: string): Promise<any> {
    const blockBlobClient = this.containerClient.getBlockBlobClient(
      sourceBlobName,
    );
    const blobUrl = blockBlobClient.url;

    const newBlobClient = this.containerClient.getBlockBlobClient(
      targetBlobName,
    );
    return newBlobClient.syncCopyFromURL(blobUrl);
  }

  /**
   * Uploads products picture.
   * @param {string} fileName - picture file name
   * @param {Buffer} data - profile picture data
   * @returns {Promise<string | undefined>} request id
   */
  async uploadProductPicture(
    fileName: string,
    data: Buffer,
  ): Promise<string | undefined> {
    return this.uploadFile(fileName, data, 'products', 'image/jpeg');
  }
}
