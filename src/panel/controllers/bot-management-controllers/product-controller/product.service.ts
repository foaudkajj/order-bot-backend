import {Injectable} from '@nestjs/common';
import {Product} from 'src/DB/models/Product';
import {DataSourceLoadOptionsBase} from 'src/panel/dtos/DevextremeQuery';
import {UIResponseBase} from 'src/panel/dtos/UIResponseBase';
import {getRepository, QueryFailedError} from 'typeorm';

@Injectable()
export class ProductService {
  constructor() {}

  async Get(query: DataSourceLoadOptionsBase) {
    let entities: Product[];
    if (query.take && query.skip) {
      entities = await getRepository(Product).find({
        take: query.take,
        skip: query.skip,
      });
    } else {
      entities = await getRepository(Product).find();
    }
    let response: UIResponseBase<Product> = {
      IsError: false,
      data: entities,
      totalCount: entities.length,
      MessageKey: 'SUCCESS',
      StatusCode: 200,
    };
    return response;
  }

  async Insert(product: Product) {
    try {
      let response: UIResponseBase<Product> = {
        IsError: false,
        Result: product,
        MessageKey: 'SUCCESS',
        StatusCode: 200,
      };
      await getRepository(Product).insert(product);
      return response;
    } catch (error) {
      console.log((error as QueryFailedError).message);
      throw <UIResponseBase<Product>>{
        IsError: true,
        MessageKey: 'ERROR',
        StatusCode: 500,
      };
    }
  }

  async Update(updateDetails: Product) {
    try {
      let product = await getRepository(Product).findOne({
        where: {Id: updateDetails.Id},
      });
      let {Id, ...updatedEntity} = {...product, ...updateDetails};
      await getRepository(Product).update({Id: product.Id}, updatedEntity);
      return <UIResponseBase<Product>>{
        IsError: false,
        Result: updatedEntity,
        MessageKey: 'SUCCESS',
        StatusCode: 200,
      };
    } catch (error) {
      console.log(error);
      throw <UIResponseBase<Product>>{
        IsError: true,
        MessageKey: 'ERROR',
        StatusCode: 500,
      };
    }
  }

  async Delete(Id: number) {
    try {
      await getRepository(Product).delete({Id: Id});
      return <UIResponseBase<Product>>{
        IsError: false,
        MessageKey: 'SUCCESS',
        StatusCode: 200,
      };
    } catch (error) {
      console.log(error);
      throw <UIResponseBase<Product>>{
        IsError: true,
        MessageKey: 'ERROR',
        StatusCode: 500,
      };
    }
  }
}
