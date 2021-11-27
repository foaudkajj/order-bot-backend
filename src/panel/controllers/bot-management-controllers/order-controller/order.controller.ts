import {Controller, Get, Post, Query, Body, Request} from '@nestjs/common';
import {Order} from 'src/db/models/order';
import {PermessionsGuard} from 'src/panel/decorators/permessions.decorator';
import {DataSourceLoadOptionsBase} from 'src/panel/dtos/devextreme-query';
import {DxGridDeleteRequest} from 'src/panel/dtos/dx-grid-delete-request';
import {DxGridUpdateRequest} from 'src/panel/dtos/dx-grid-update-request';
import {UIResponseBase} from 'src/panel/dtos/ui-response-base';
import {PermessionEnum} from 'src/panel/enums/PermessionsEnum';
import {OrderService} from './order.service';

@Controller('api/Orders')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Get('Get')
  @PermessionsGuard(PermessionEnum.SHOW_ORDER)
  async Get(
    @Query() query: DataSourceLoadOptionsBase,
    @Request() request,
  ): Promise<UIResponseBase<Order>> {
    const {MerchantId} = request.user;
    const result = await this.orderService.Get(query, MerchantId);
    return result;
  }

  @Post('Insert')
  @PermessionsGuard(PermessionEnum.ADD_ORDER)
  async Insert(@Body() body): Promise<UIResponseBase<Order>> {
    const {MerchantId} = body.user;
    const entity = JSON.parse(body.values) as Order;
    const result = await this.orderService.Insert(MerchantId, entity);
    return result;
  }

  @Post('Update')
  @PermessionsGuard(PermessionEnum.UPDATE_ORDER)
  async Update(
    @Body() body: DxGridUpdateRequest,
    @Request() request,
  ): Promise<UIResponseBase<Order>> {
    const {MerchantId} = request.user;
    const entity = {...JSON.parse(body.values)} as Order;
    entity.Id = body.key;
    entity.merchantId = MerchantId;
    const result = await this.orderService.Update(entity);
    return result;
  }

  @Post('Delete')
  @PermessionsGuard(PermessionEnum.DELETE_ORDER)
  async Delete(
    @Body() deleteRequest: DxGridDeleteRequest,
    @Request() request,
  ): Promise<UIResponseBase<Order>> {
    const {MerchantId} = request.user;
    const result = await this.orderService.Delete(
      deleteRequest.key,
      MerchantId,
    );
    return result;
  }
}
