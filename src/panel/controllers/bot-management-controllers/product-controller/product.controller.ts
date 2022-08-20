import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  Request,
  UseInterceptors,
  UploadedFile,
  HttpStatus,
} from '@nestjs/common';
import {Product} from 'src/models/product';
import {PermissionsGuard} from 'src/panel/decorators/permissions.decorator';
import {PermissionEnum} from 'src/panel/enums/permissions-enum';
import {ProductService} from './product.service';
import {Express} from 'express';
import {
  DataSourceLoadOptionsBase,
  DxGridDeleteRequest,
  DxGridUpdateRequest,
  UIResponseBase,
} from 'src/panel/dtos';
import {FileInterceptor} from '@nestjs/platform-express';

@Controller('api/Products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get('Get')
  @PermissionsGuard(PermissionEnum.SHOW_PRODUCT)
  async Get(
    @Query() query: DataSourceLoadOptionsBase,
    @Request() request,
  ): Promise<UIResponseBase<Product[]>> {
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
    const entity = {...JSON.parse(body.values)} as Product;
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
  ): Promise<void> {
    return this.productService.Delete(deleteBody.key, request.merchantId);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('files[]'))
  @PermissionsGuard(PermissionEnum.UPDATE_PRODUCT)
  async uploadPicture(@UploadedFile() file: Express.Multer.File) {
    await this.productService.uploadPicture(file);

    return HttpStatus.OK;
  }
}
