import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  Request,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {Order} from 'src/models/order';
import {PermissionsGuard} from 'src/panel/decorators/permissions.decorator';
import {CancelOrderRequest} from 'src/panel/dtos';
import {DataSourceLoadOptionsBase} from 'src/panel/dtos/devextreme-query';
import {DxGridDeleteRequest} from 'src/panel/dtos/dx-grid-delete.request';
import {DxGridUpdateRequest} from 'src/panel/dtos/dx-grid-update.request';
import {UIResponseBase} from 'src/panel/dtos/ui-response-base';
import {PermissionEnum} from 'src/panel/enums/permissions-enum';
import {OrderService} from './order.service';

@Controller('api/orders')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Get('get')
  @PermissionsGuard(PermissionEnum.SHOW_ORDER)
  async Get(
    @Query() query: DataSourceLoadOptionsBase,
    @Request() request,
  ): Promise<UIResponseBase<Order[]>> {
    const result = await this.orderService.get(query, request.merchantId);
    return result;
  }

  @Post('insert')
  @PermissionsGuard(PermissionEnum.ADD_ORDER)
  async Insert(@Body() body): Promise<UIResponseBase<Order>> {
    const {MerchantId} = body.user;
    const entity = JSON.parse(body.values) as Order;
    const result = await this.orderService.insert(MerchantId, entity);
    return result;
  }

  @Post('update')
  @PermissionsGuard(PermissionEnum.UPDATE_ORDER)
  async Update(
    @Body() body: DxGridUpdateRequest,
    @Request() request,
  ): Promise<UIResponseBase<Order>> {
    const entity = {...JSON.parse(body.values)} as Order;
    entity.id = body.key;
    entity.merchantId = request.merchantId;
    const result = await this.orderService.update(entity);
    return result;
  }

  @Post('delete')
  @PermissionsGuard(PermissionEnum.DELETE_ORDER)
  async Delete(
    @Body() deleteRequest: DxGridDeleteRequest,
    @Request() request,
  ): Promise<void> {
    return this.orderService.delete(deleteRequest.key, request.merchantId);
  }

  @Post('cancel')
  @PermissionsGuard(PermissionEnum.SHOW_ORDER)
  async Cancel(
    @Body() cancelOrder: CancelOrderRequest,
    @Request() request,
  ): Promise<void> {
    if (!cancelOrder || !cancelOrder.orderId) {
      throw new HttpException('ORDER_ID_NOT_PROVIDED', HttpStatus.BAD_REQUEST);
    }
    return await this.orderService.cancelOrder(cancelOrder, request.merchantId);
  }
}
