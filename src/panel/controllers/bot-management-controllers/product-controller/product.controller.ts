import {Controller, Get, Post, Query, Body, Request} from '@nestjs/common';
import {Product} from 'src/DB/models/product';
import {PermessionsGuard} from 'src/panel/decorators/permessions.decorator';
import {DataSourceLoadOptionsBase} from 'src/panel/dtos/devextreme-query';
import {DxGridDeleteRequest} from 'src/panel/dtos/dx-grid-delete-request';
import {DxGridUpdateRequest} from 'src/panel/dtos/dx-grid-update-request';
import {UIResponseBase} from 'src/panel/dtos/ui-response-base';
import {PermessionEnum} from 'src/panel/enums/PermessionsEnum';
import {ProductService} from './product.service';

@Controller('api/Products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get('Get')
  @PermessionsGuard(PermessionEnum.SHOW_PRODUCT)
  async Get(
    @Query() query: DataSourceLoadOptionsBase,
    @Request() request,
  ): Promise<UIResponseBase<Product>> {
    const {MerchantId} = request.user;
    const result = await this.productService.Get(query, MerchantId);
    return result;
  }

  @Post('Insert')
  @PermessionsGuard(PermessionEnum.ADD_PRODUCT)
  async Insert(
    @Body() body,
    @Request() request,
  ): Promise<UIResponseBase<Product>> {
    const entity = JSON.parse(body.values) as Product;
    const {MerchantId} = request.user;
    if (entity) {
      entity.merchantId = MerchantId;
    }
    const result = await this.productService.Insert(entity);
    return result;
  }

  @Post('Update')
  @PermessionsGuard(PermessionEnum.UPDATE_PRODUCT)
  async Update(
    @Body() body: DxGridUpdateRequest,
    @Request() request,
  ): Promise<UIResponseBase<Product>> {
    const entity = {...JSON.parse(body.values)} as Product;
    entity.id = body.key;

    const {MerchantId} = request.user;
    if (entity) {
      entity.merchantId = MerchantId;
    }

    const result = await this.productService.Update(entity);
    return result;
  }

  @Post('Delete')
  @PermessionsGuard(PermessionEnum.DELETE_PRODUCT)
  async Delete(
    @Body() deleteBody: DxGridDeleteRequest,
    @Request() request,
  ): Promise<UIResponseBase<Product>> {
    const {MerchantId} = request.user;

    const result = await this.productService.Delete(deleteBody.key, MerchantId);
    return result;
  }
}
