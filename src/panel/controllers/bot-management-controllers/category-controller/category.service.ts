import {Injectable} from '@nestjs/common';
import {CategoryRepository} from 'src/db/repositories';
import {Category} from 'src/models';
import {DataSourceLoadOptionsBase} from 'src/panel/dtos/devextreme-query';
import {UIResponseBase} from 'src/panel/dtos/ui-response-base';

@Injectable()
export class CategoryService {
  constructor(private categoryRepository: CategoryRepository) {}

  async Get(query: DataSourceLoadOptionsBase, merchantId: number) {
    let categories: Category[];
    if (query.take && query.skip) {
      categories = await this.categoryRepository.orm.find({
        take: query.take,
        skip: query.skip,
        where: {merchantId: merchantId},
      });
    } else {
      categories = await this.categoryRepository.orm.find({
        where: {merchantId: merchantId},
      });
    }
    const response: UIResponseBase<Category> = {
      isError: false,
      data: categories,
      totalCount: categories.length,
      messageKey: 'SUCCESS',
      statusCode: 200,
    };
    return response;
  }

  async Insert(category: Category) {
    try {
      const response: UIResponseBase<Category> = {
        isError: false,
        result: category,
        messageKey: 'SUCCESS',
        statusCode: 200,
      };
      const sameCategory = await this.categoryRepository.orm.findOne({
        where: {categoryKey: category.categoryKey},
      });
      if (sameCategory) {
        const err = <UIResponseBase<Category>>{
          isError: true,
          messageKey: 'CATEGORY_KEY_EXISTS',
          statusCode: 500,
        };
        throw new Error(JSON.stringify(err));
      } else {
        await this.categoryRepository.orm.insert(category);
      }
      return response;
    } catch (error) {
      throw new Error(error);
    }
  }

  async Update(updateDetails: Category) {
    try {
      const category = await this.categoryRepository.orm.findOne({
        where: {id: updateDetails.id},
      });
      const {id: _, ...updatedEntity} = {...category, ...updateDetails};
      await this.categoryRepository.orm.update(
        {id: category.id, merchantId: updateDetails.merchantId},
        updatedEntity,
      );
      return <UIResponseBase<Category>>{
        isError: false,
        result: updatedEntity,
        messageKey: 'SUCCESS',
        statusCode: 200,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async Delete(Id: number, merchantId: number) {
    try {
      await this.categoryRepository.orm.delete({
        id: Id,
        merchantId: merchantId,
      });
      return <UIResponseBase<Category>>{
        isError: false,
        messageKey: 'SUCCESS',
        statusCode: 200,
      };
    } catch (error) {
      throw new Error(error);
    }
  }
}
