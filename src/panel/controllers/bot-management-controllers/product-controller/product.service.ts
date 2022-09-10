import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {ProductRepository} from 'src/db/repositories';
import {StoragePrefix} from 'src/models';
import {Product} from 'src/models/product';
import {DataSourceLoadOptionsBase} from 'src/panel/dtos/devextreme-query';
import {UIResponseBase} from 'src/panel/dtos/ui-response-base';
import {StorageBlobService} from 'src/services';
import {removeHtmlTags} from 'src/utils';
@Injectable()
export class ProductService {
  constructor(
    private productRepository: ProductRepository,
    private storageBlobService: StorageBlobService,
  ) {}

  async get(query: DataSourceLoadOptionsBase, merchantId: number) {
    let entities: Product[];
    if (query.take && query.skip) {
      entities = await this.productRepository.orm.find({
        take: query.take,
        skip: query.skip,
        where: {merchantId: merchantId},
      });
    } else {
      entities = await this.productRepository.orm.find({
        where: {merchantId: merchantId},
      });
    }
    const response: UIResponseBase<Product[]> = {
      data: entities,
      totalCount: entities.length,
    };
    return response;
  }

  async insert(product: Product) {
    try {
      const response: UIResponseBase<Product> = {
        data: product,
      };
      product.description = removeHtmlTags(product.description);
      await this.productRepository.orm.insert(product);
      return response;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(updateDetails: Product) {
    try {
      const product = await this.productRepository.orm.findOne({
        where: {id: updateDetails.id},
      });
      const {id: _, ...updatedEntity} = {...product, ...updateDetails};
      product.description = removeHtmlTags(product.description);
      await this.productRepository.orm.update({id: product.id}, updatedEntity);
      return <UIResponseBase<Product>>{
        data: updatedEntity,
      };
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async Delete(Id: number, MerchantId: number) {
    try {
      const product = await this.productRepository.orm.findOne({
        where: {id: Id},
      });
      if (product.thumbUrl) {
        await this.storageBlobService.deleteFile(
          `${StoragePrefix.Products}/${product.thumbUrl}`,
        );
      }
      await this.productRepository.orm.delete({id: Id, merchantId: MerchantId});
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async uploadPicture(file: Express.Multer.File) {
    await this.storageBlobService.uploadProductPicture(
      file.originalname,
      file.buffer,
    );
  }
}
