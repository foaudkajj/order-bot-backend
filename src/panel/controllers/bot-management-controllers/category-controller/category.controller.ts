import {Controller, Get, Post, Query, Body} from '@nestjs/common';
import {Category} from 'src/DB/models/Category';
import {DataSourceLoadOptionsBase} from 'src/panel/dtos/DevextremeQuery';
import {DxGridDeleteRequest} from 'src/panel/dtos/DxGridDeleteRequest';
import {DxGridUpdateRequest} from 'src/panel/dtos/DxGridUpdateRequest';
import {UIResponseBase} from 'src/panel/dtos/UIResponseBase';
import {PermessionsGuard} from '../../../decorators/permessions.decorator';
import {PermessionEnum} from '../../../enums/PermessionsEnum';
import {CategoryService} from './category.service';

@Controller('api/Category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get('Get')
  @PermessionsGuard(PermessionEnum.SHOW_CATEGORY)
  async Get(
    @Query() query: DataSourceLoadOptionsBase,
  ): Promise<UIResponseBase<Category>> {
    let result = await this.categoryService.Get(query);
    return result;
  }

  @Post('Insert')
  @PermessionsGuard(PermessionEnum.ADD_CATEGORY)
  async Insert(@Body() request): Promise<UIResponseBase<Category>> {
    let entity = JSON.parse(request.values) as Category;
    let result = await this.categoryService.Insert(entity);
    return result;
  }

  @Post('Update')
  @PermessionsGuard(PermessionEnum.UPDATE_CATEGORY)
  async Update(
    @Body() request: DxGridUpdateRequest,
  ): Promise<UIResponseBase<Category>> {
    let entity = {...JSON.parse(request.values)} as Category;
    entity.Id = request.key;
    let result = await this.categoryService.Update(entity);
    return result;
  }

  @Post('Delete')
  @PermessionsGuard(PermessionEnum.DELETE_CATEGORY)
  async Delete(
    @Body() deleteRequest: DxGridDeleteRequest,
  ): Promise<UIResponseBase<Category>> {
    let result = await this.categoryService.Delete(deleteRequest.key);
    return result;
  }
}
