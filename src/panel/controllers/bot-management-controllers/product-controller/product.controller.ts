import { Controller, Get, Post, Query, Body } from '@nestjs/common';
import { Product } from 'src/DB/models/Product';
import { PermessionsGuard } from 'src/panel/decorators/permessions.decorator';
import { DataSourceLoadOptionsBase } from 'src/panel/dtos/DevextremeQuery';
import { DxGridDeleteRequest } from 'src/panel/dtos/DxGridDeleteRequest';
import { DxGridUpdateRequest } from 'src/panel/dtos/DxGridUpdateRequest';
import { UIResponseBase } from 'src/panel/dtos/UIResponseBase';
import { PermessionEnum } from 'src/panel/enums/PermessionsEnum';
import { ProductService } from './product.service';

@Controller('api/Products')
export class ProductController {

    constructor(private productService: ProductService) {

    }

    @Get('Get')
    @PermessionsGuard(PermessionEnum.SHOW_PRODUCT)
    async Get(@Query() query: DataSourceLoadOptionsBase): Promise<UIResponseBase<Product>> {
        let result = await this.productService.Get(query);
        return result;
    }

    @Post('Insert')
    @PermessionsGuard(PermessionEnum.ADD_PRODUCT)
    async Insert(@Body() request): Promise<UIResponseBase<Product>> {
        let entity = JSON.parse(request.values) as Product;
        let result = await this.productService.Insert(entity);
        return result;
    }

    @Post('Update')
    @PermessionsGuard(PermessionEnum.UPDATE_PRODUCT)
    async Update(@Body() request: DxGridUpdateRequest): Promise<UIResponseBase<Product>> {
        let entity = { ...JSON.parse(request.values) } as Product;
        entity.Id = request.key;
        let result = await this.productService.Update(entity);
        return result;
    }

    @Post('Delete')
    @PermessionsGuard(PermessionEnum.DELETE_PRODUCT)
    async Delete(@Body() deleteRequest: DxGridDeleteRequest): Promise<UIResponseBase<Product>> {
        let result = await this.productService.Delete(deleteRequest.key);
        return result;
    }
}