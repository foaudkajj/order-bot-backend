import { Controller, Get, Post, Query, Body, Request } from '@nestjs/common';
import { Product } from 'src/DB/models/product';
import { PermissionsGuard } from 'src/panel/decorators/permissions.decorator';
import { DataSourceLoadOptionsBase } from 'src/panel/dtos/devextreme-query';
import { DxGridDeleteRequest } from 'src/panel/dtos/dx-grid-delete-request';
import { DxGridUpdateRequest } from 'src/panel/dtos/dx-grid-update-request';
import { UIResponseBase } from 'src/panel/dtos/ui-response-base';
import { PermissionEnum } from 'src/panel/enums/permissions-enum';
import { ProductService } from './product.service';

@Controller('api/Products')
export class ProductController {
  constructor(private productService: ProductService) { }

  @Get('Get')
  @PermissionsGuard(PermissionEnum.SHOW_PRODUCT)
  async Get(
    @Query() query: DataSourceLoadOptionsBase,
    @Request() request,
  ): Promise<UIResponseBase<Product>> {
    const result = await this.productService.Get(query, request.merchantId);
    return result;
  }

  @Post('Insert')
  @PermissionsGuard(PermissionEnum.ADD_PRODUCT)
  async Insert(
    @Body() body,
    @Request() request,
  ): Promise<UIResponseBase<Product>> {
    const entity = JSON.parse(body.values) as Product;

    if (entity) {
      entity.merchantId = request.merchantId;
    }
    const result = await this.productService.Insert(entity);
    return result;
  }

  @Post('Update')
  @PermissionsGuard(PermissionEnum.UPDATE_PRODUCT)
  async Update(
    @Body() body: DxGridUpdateRequest,
    @Request() request,
  ): Promise<UIResponseBase<Product>> {
    const entity = { ...JSON.parse(body.values) } as Product;
    entity.id = body.key;

    if (entity) {
      entity.merchantId = request.merchantId;
    }

    const result = await this.productService.Update(entity);
    return result;
  }

  @Post('Delete')
  @PermissionsGuard(PermissionEnum.DELETE_PRODUCT)
  async Delete(
    @Body() deleteBody: DxGridDeleteRequest,
    @Request() request,
  ): Promise<UIResponseBase<Product>> {
    const result = await this.productService.Delete(deleteBody.key, request.merchantId);
    return result;
  }
}
