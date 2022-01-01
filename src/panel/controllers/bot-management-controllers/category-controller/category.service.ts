import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Category} from 'src/db/models';
import {DataSourceLoadOptionsBase} from 'src/panel/dtos/devextreme-query';
import {UIResponseBase} from 'src/panel/dtos/ui-response-base';
import {QueryFailedError, Repository} from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async Get(query: DataSourceLoadOptionsBase, merchantId: number) {
    let categories: Category[];
    if (query.take && query.skip) {
      categories = await this.categoryRepository.find({
        take: query.take,
        skip: query.skip,
        where: {merchantId: merchantId},
      });
    } else {
      categories = await this.categoryRepository.find({
        where: {merchantId: merchantId},
      });
    }
    const response: UIResponseBase<Category> = {
      IsError: false,
      data: categories,
      totalCount: categories.length,
      MessageKey: 'SUCCESS',
      StatusCode: 200,
    };
    return response;
  }

  async Insert(category: Category) {
    try {
      const response: UIResponseBase<Category> = {
        IsError: false,
        Result: category,
        MessageKey: 'SUCCESS',
        StatusCode: 200,
      };
      const SameCategory = await this.categoryRepository.findOne({
        where: {categoryKey: category.categoryKey},
      });
      if (SameCategory) {
        const err = <UIResponseBase<Category>>{
          IsError: true,
          MessageKey: 'CATEGORY_KEY_EXISTS',
          StatusCode: 500,
        };
        throw new Error(JSON.stringify(err));
      } else {
        await this.categoryRepository.insert(category);
      }
      return response;
    } catch (error) {
      console.log((error as QueryFailedError).message);
      const err = <UIResponseBase<Category>>{
        IsError: true,
        MessageKey: 'ERROR',
        StatusCode: 500,
      };
      throw new Error(JSON.stringify(err));
    }
  }

  async Update(updateDetails: Category) {
    try {
      const category = await this.categoryRepository.findOne({
        where: {id: updateDetails.id},
      });
      const {id: Id, ...updatedEntity} = {...category, ...updateDetails};
      await this.categoryRepository.update(
        {id: category.id, merchantId: updateDetails.merchantId},
        updatedEntity,
      );
      return <UIResponseBase<Category>>{
        IsError: false,
        Result: updatedEntity,
        MessageKey: 'SUCCESS',
        StatusCode: 200,
      };
    } catch (error) {
      console.log(error);
      const err = <UIResponseBase<Category>>{
        IsError: true,
        MessageKey: 'ERROR',
        StatusCode: 500,
      };
      throw new Error(JSON.stringify(err));
    }
  }

  async Delete(Id: number, MerchantId: number) {
    try {
      await this.categoryRepository.delete({id: Id, merchantId: MerchantId});
      return <UIResponseBase<Category>>{
        IsError: false,
        MessageKey: 'SUCCESS',
        StatusCode: 200,
      };
    } catch (error) {
      console.log(error);
      const err = <UIResponseBase<Category>>{
        IsError: true,
        MessageKey: 'ERROR',
        StatusCode: 500,
      };
      throw new Error(JSON.stringify(err));
    }
  }
}
