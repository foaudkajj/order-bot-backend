import { Controller, Get, Post, Query, Body, Request } from '@nestjs/common';
import { Category } from 'src/db/models';
import { DataSourceLoadOptionsBase } from 'src/panel/dtos/devextreme-query';
import { DxGridDeleteRequest } from 'src/panel/dtos/dx-grid-delete-request';
import { DxGridUpdateRequest } from 'src/panel/dtos/dx-grid-update-request';
import { UIResponseBase } from 'src/panel/dtos/ui-response-base';
import { PermissionsGuard } from '../../../decorators/permissions.decorator';
import { PermissionEnum } from '../../../enums/permissions-enum';
import { CategoryService } from './category.service';

@Controller('api/Category')
export class CategoryController {
  constructor(private categoryService: CategoryService) { }

  @Get('Get')
  @PermissionsGuard(PermissionEnum.SHOW_CATEGORY)
  async Get(
    @Query() query: DataSourceLoadOptionsBase,
    @Request() request,
  ): Promise<UIResponseBase<Category>> {
    const { MerchantId } = request.user;
    const result = await this.categoryService.Get(query, MerchantId);
    return result;
  }

  @Post('Insert')
  @PermissionsGuard(PermissionEnum.ADD_CATEGORY)
  async Insert(
    @Body() body,
    @Request() request,
  ): Promise<UIResponseBase<Category>> {
    const { MerchantId } = request.user;
    const entity = JSON.parse(body.values) as Category;
    if (entity) {
      entity.merchantId = MerchantId;
    }
    const result = await this.categoryService.Insert(entity);
    return result;
  }

  @Post('Update')
  @PermissionsGuard(PermissionEnum.UPDATE_CATEGORY)
  async Update(
    @Body() body: DxGridUpdateRequest,
    @Request() request,
  ): Promise<UIResponseBase<Category>> {
    const entity = { ...JSON.parse(body.values) } as Category;
    entity.id = body.key;

    const { MerchantId } = request.user;
    entity.merchantId = MerchantId;
    const result = await this.categoryService.Update(entity);
    return result;
  }

  @Post('Delete')
  @PermissionsGuard(PermissionEnum.DELETE_CATEGORY)
  async Delete(
    @Body() deleteRequest: DxGridDeleteRequest,
    @Request() request,
  ): Promise<UIResponseBase<Category>> {
    const { MerchantId } = request.user;
    const result = await this.categoryService.Delete(
      deleteRequest.key,
      MerchantId,
    );
    return result;
  }
}
