import {Injectable} from '@nestjs/common';
import {ProductRepository} from 'src/bot/repositories';
import {Product} from 'src/db/models/product';
import {DataSourceLoadOptionsBase} from 'src/panel/dtos/devextreme-query';
import {UIResponseBase} from 'src/panel/dtos/ui-response-base';
@Injectable()
export class ProductService {
  constructor(private productRepository: ProductRepository) {}

  async Get(query: DataSourceLoadOptionsBase, merchantId: number) {
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
    const response: UIResponseBase<Product> = {
      isError: false,
      data: entities,
      totalCount: entities.length,
      messageKey: 'SUCCESS',
      statusCode: 200,
    };
    return response;
  }

  async Insert(product: Product) {
    try {
      const response: UIResponseBase<Product> = {
        isError: false,
        result: product,
        messageKey: 'SUCCESS',
        statusCode: 200,
      };
      await this.productRepository.orm.insert(product);
      return response;
    } catch (error) {
      throw new Error(error);
    }
  }

  async Update(updateDetails: Product) {
    try {
      const product = await this.productRepository.orm.findOne({
        where: {id: updateDetails.id},
      });
      const {id: _, ...updatedEntity} = {...product, ...updateDetails};
      await this.productRepository.orm.update({id: product.id}, updatedEntity);
      return <UIResponseBase<Product>>{
        isError: false,
        result: updatedEntity,
        messageKey: 'SUCCESS',
        statusCode: 200,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async Delete(Id: number, MerchantId: number) {
    try {
      await this.productRepository.orm.delete({id: Id, merchantId: MerchantId});
      return <UIResponseBase<Product>>{
        isError: false,
        messageKey: 'SUCCESS',
        statusCode: 200,
      };
    } catch (error) {
      throw new Error(error);
    }
  }
}
