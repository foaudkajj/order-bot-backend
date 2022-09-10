import {Controller, Get, Post, Query, Body, Request} from '@nestjs/common';
import {Category} from 'src/models';
import {DataSourceLoadOptionsBase} from 'src/panel/dtos/devextreme-query';
import {DxGridDeleteRequest} from 'src/panel/dtos/dx-grid-delete.request';
import {DxGridUpdateRequest} from 'src/panel/dtos/dx-grid-update.request';
import {UIResponseBase} from 'src/panel/dtos/ui-response-base';
import {PermissionsGuard} from '../../../decorators/permissions.decorator';
import {PermissionEnum} from '../../../enums/permissions-enum';
import {CategoryService} from './category.service';

@Controller('api/category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get('get')
  @PermissionsGuard(PermissionEnum.SHOW_CATEGORY)
  async Get(
    @Query() query: DataSourceLoadOptionsBase,
    @Request() request,
  ): Promise<UIResponseBase<Category[]>> {
    const result = await this.categoryService.get(query, request.merchantId);
    return result;
  }

  @Post('insert')
  @PermissionsGuard(PermissionEnum.ADD_CATEGORY)
  async Insert(
    @Body() body,
    @Request() request,
  ): Promise<UIResponseBase<Category>> {
    const entity = JSON.parse(body.values) as Category;
    if (entity) {
      entity.merchantId = request.merchantId;
    }
    const result = await this.categoryService.insert(entity);
    return result;
  }

  @Post('update')
  @PermissionsGuard(PermissionEnum.UPDATE_CATEGORY)
  async Update(
    @Body() body: DxGridUpdateRequest,
    @Request() request,
  ): Promise<UIResponseBase<Category>> {
    const entity = {...JSON.parse(body.values)} as Category;
    entity.id = body.key;
    entity.merchantId = request.merchantId;
    const result = await this.categoryService.update(entity);
    return result;
  }

  @Post('delete')
  @PermissionsGuard(PermissionEnum.DELETE_CATEGORY)
  async Delete(
    @Body() deleteRequest: DxGridDeleteRequest,
    @Request() request,
  ): Promise<void> {
    return this.categoryService.delete(deleteRequest.key, request.merchantId);
  }
}
