import {Injectable} from '@nestjs/common';
import {ProductRepository} from 'src/db/repositories';
import {Product} from 'src/models/product';
import {DataSourceLoadOptionsBase} from 'src/panel/dtos/devextreme-query';
import {UIResponseBase} from 'src/panel/dtos/ui-response-base';
import {FreeImageHostingService} from 'src/services';
import {generateUniqueNumber, removeHtmlTags} from 'src/shared/utils';
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
    let newCode = generateUniqueNumber(6);

    let newCodeExists = await this.productRepository.orm.exists({
      where: {merchantId: product.merchantId, code: newCode},
    });

    while (newCodeExists) {
      newCode = generateUniqueNumber(6);
      newCodeExists = await this.productRepository.orm.exists({
        where: {merchantId: product.merchantId, code: newCode},
      });
    }

    product.code = newCode;
    await this.productRepository.orm.insert(product);
    return response;
  }

  async update(updateDetails: Product) {
    const product = await this.productRepository.orm.findOne({
      where: {id: updateDetails.id},
    });
    const {id: _, ...updatedEntity} = {...product, ...updateDetails};
    product.description = removeHtmlTags(product.description);
    delete product.code; // not allowed to update code
    await this.productRepository.orm.update({id: product.id}, updatedEntity);
    return <UIResponseBase<Product>>{
      data: updatedEntity,
    };
  }

  async delete(Id: number, MerchantId: number) {
    await this.productRepository.orm.delete({id: Id, merchantId: MerchantId});
  }

  async uploadPicture(productId: number, file: Express.Multer.File) {
    return this.freeImageHostingService.upload(file.buffer);
  }
}
