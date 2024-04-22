import {Injectable} from '@nestjs/common';
import {ProductRepository} from 'src/db/repositories';
import {Product} from 'src/models/product';
import {DataSourceLoadOptionsBase} from 'src/panel/dtos/devextreme-query';
import {UIResponseBase} from 'src/panel/dtos/ui-response-base';
import {FreeImageHostingService} from 'src/services';
import {removeHtmlTags} from 'src/shared/utils';
import {Express} from 'express';
@Injectable()
export class ProductService {
  constructor(
    private productRepository: ProductRepository,
    private freeImageHostingService: FreeImageHostingService,
  ) {}

  async get(query: DataSourceLoadOptionsBase, merchantId: number) {
    let entities: Product[];
    if (query.take && query.skip) {
      entities = await this.productRepository.orm.find({
        take: query.take,
        skip: query.skip,
        where: {merchantId},
      });
    } else {
      entities = await this.productRepository.orm.find({
        where: {merchantId},
      });
    }
    const response: UIResponseBase<Product[]> = {
      data: entities,
      totalCount: entities.length,
    };
    return response;
  }

  async insert(product: Product) {
    const response: UIResponseBase<Product> = {
      data: product,
    };
    product.description = removeHtmlTags(product.description);
    await this.productRepository.orm.insert(product);
    return response;
  }

  async update(updateDetails: Product) {
    const product = await this.productRepository.orm.findOne({
      where: {id: updateDetails.id},
    });
    const {id: _, ...updatedEntity} = {...product, ...updateDetails};
    product.description = removeHtmlTags(product.description);
    await this.productRepository.orm.update({id: product.id}, updatedEntity);
    return <UIResponseBase<Product>>{
      data: updatedEntity,
    };
  }

  async Delete(Id: number, MerchantId: number) {
    await this.productRepository.orm.delete({id: Id, merchantId: MerchantId});
  }

  async uploadPicture(productId: number, file: Express.Multer.File) {
    const result = await this.freeImageHostingService.upload(file.buffer);
    if (result.success === true) {
      await this.productRepository.orm.update(productId, {
        thumbUrl: result?.thumb?.url,
      });
    }
    return result;
  }
}
