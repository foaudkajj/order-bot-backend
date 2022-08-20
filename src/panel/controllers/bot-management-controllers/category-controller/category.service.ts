import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
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
    const response: UIResponseBase<Category[]> = {
      data: categories,
      totalCount: categories.length,
    };
    return response;
  }

  async Insert(category: Category) {
    try {
      const response: UIResponseBase<Category> = {
        data: category,
      };
      const sameCategory = await this.categoryRepository.orm.findOne({
        where: {categoryKey: category.categoryKey},
      });
      if (sameCategory) {
        throw new HttpException(
          'CATEGORY_KEY_EXISTS',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      } else {
        await this.categoryRepository.orm.insert(category);
      }
      return response;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
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
        data: updatedEntity,
      };
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async Delete(Id: number, merchantId: number) {
    try {
      await this.categoryRepository.orm.delete({
        id: Id,
        merchantId: merchantId,
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
