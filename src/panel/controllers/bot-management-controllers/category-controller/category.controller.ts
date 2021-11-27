import {Controller, Get, Post, Query, Body, Request} from '@nestjs/common';
import {Category} from 'src/db/models';
import {DataSourceLoadOptionsBase} from 'src/panel/dtos/devextreme-query';
import {DxGridDeleteRequest} from 'src/panel/dtos/dx-grid-delete-request';
import {DxGridUpdateRequest} from 'src/panel/dtos/dx-grid-update-request';
import {UIResponseBase} from 'src/panel/dtos/ui-response-base';
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
    @Request() request,
  ): Promise<UIResponseBase<Category>> {
    const {MerchantId} = request.user;
    const result = await this.categoryService.Get(query, MerchantId);
    return result;
  }

  @Post('Insert')
  @PermessionsGuard(PermessionEnum.ADD_CATEGORY)
  async Insert(
    @Body() body,
    @Request() request,
  ): Promise<UIResponseBase<Category>> {
    const {MerchantId} = request.user;
    const entity = JSON.parse(body.values) as Category;
    if (entity) {
      entity.merchantId = MerchantId;
    }
    const result = await this.categoryService.Insert(entity);
    return result;
  }

  @Post('Update')
  @PermessionsGuard(PermessionEnum.UPDATE_CATEGORY)
  async Update(
    @Body() body: DxGridUpdateRequest,
    @Request() request,
  ): Promise<UIResponseBase<Category>> {
    const entity = {...JSON.parse(body.values)} as Category;
    entity.Id = body.key;

    const {MerchantId} = request.user;
    entity.merchantId = MerchantId;
    const result = await this.categoryService.Update(entity);
    return result;
  }

  @Post('Delete')
  @PermessionsGuard(PermessionEnum.DELETE_CATEGORY)
  async Delete(
    @Body() deleteRequest: DxGridDeleteRequest,
    @Request() request,
  ): Promise<UIResponseBase<Category>> {
    const {MerchantId} = request.user;
    const result = await this.categoryService.Delete(
      deleteRequest.key,
      MerchantId,
    );
    return result;
  }
}
