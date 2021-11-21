import {Injectable} from '@nestjs/common';
import {Category} from 'src/DB/models/Category';
import {DataSourceLoadOptionsBase} from 'src/panel/dtos/DevextremeQuery';
import {UIResponseBase} from 'src/panel/dtos/UIResponseBase';
import {getRepository, QueryFailedError} from 'typeorm';

@Injectable()
export class CategoryService {
  constructor() {}

  async Get(query: DataSourceLoadOptionsBase) {
    let categories: Category[];
    if (query.take && query.skip) {
      categories = await getRepository(Category).find({
        take: query.take,
        skip: query.skip,
      });
    } else {
      categories = await getRepository(Category).find();
    }
    let response: UIResponseBase<Category> = {
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
      let response: UIResponseBase<Category> = {
        IsError: false,
        Result: category,
        MessageKey: 'SUCCESS',
        StatusCode: 200,
      };
      let SameCategory = await getRepository(Category).findOne({
        where: {CategoryKey: category.CategoryKey},
      });
      if (SameCategory) {
        throw <UIResponseBase<Category>>{
          IsError: true,
          MessageKey: 'CATEGORY_KEY_EXISTS',
          StatusCode: 500,
        };
      } else {
        await getRepository(Category).insert(category);
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
      let category = await getRepository(Category).findOne({
        where: {Id: updateDetails.Id},
      });
      let {Id, ...updatedEntity} = {...category, ...updateDetails};
      console.log(updatedEntity);
      await getRepository(Category).update({Id: category.Id}, updatedEntity);
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
      await getRepository(Category).delete({Id: Id});
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
