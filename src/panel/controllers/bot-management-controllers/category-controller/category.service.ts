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

  async Get(query: DataSourceLoadOptionsBase) {
    let categories: Category[];
    if (query.take && query.skip) {
      categories = await this.categoryRepository.find({
        take: query.take,
        skip: query.skip,
      });
    } else {
      categories = await this.categoryRepository.find();
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
        where: {CategoryKey: category.CategoryKey},
      });
      if (SameCategory) {
        throw <UIResponseBase<Category>>{
          IsError: true,
          MessageKey: 'CATEGORY_KEY_EXISTS',
          StatusCode: 500,
        };
      } else {
        await this.categoryRepository.insert(category);
      }
      return response;
    } catch (error) {
      console.log((error as QueryFailedError).message);
      throw <UIResponseBase<Category>>{
        IsError: true,
        MessageKey: 'ERROR',
        StatusCode: 500,
      };
    }
  }

  async Update(updateDetails: Category) {
    try {
      const category = await this.categoryRepository.findOne({
        where: {Id: updateDetails.Id},
      });
      const {Id, ...updatedEntity} = {...category, ...updateDetails};
      console.log(updatedEntity);
      await this.categoryRepository.update({Id: category.Id}, updatedEntity);
      return <UIResponseBase<Category>>{
        IsError: false,
        Result: updatedEntity,
        MessageKey: 'SUCCESS',
        StatusCode: 200,
      };
    } catch (error) {
      console.log(error);
      throw <UIResponseBase<Category>>{
        IsError: true,
        MessageKey: 'ERROR',
        StatusCode: 500,
      };
    }
  }

  async Delete(Id: number) {
    try {
      await this.categoryRepository.delete({Id: Id});
      return <UIResponseBase<Category>>{
        IsError: false,
        MessageKey: 'SUCCESS',
        StatusCode: 200,
      };
    } catch (error) {
      console.log(error);
      throw <UIResponseBase<Category>>{
        IsError: true,
        MessageKey: 'ERROR',
        StatusCode: 500,
      };
    }
  }
}
