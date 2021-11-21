import { Controller, Get, Post, Query, Body } from '@nestjs/common';
import { Order } from 'src/DB/models/Order';
import { PermessionsGuard } from 'src/panel/decorators/permessions.decorator';
import { DataSourceLoadOptionsBase } from 'src/panel/dtos/DevextremeQuery';
import { DxGridDeleteRequest } from 'src/panel/dtos/DxGridDeleteRequest';
import { DxGridUpdateRequest } from 'src/panel/dtos/DxGridUpdateRequest';
import { UIResponseBase } from 'src/panel/dtos/UIResponseBase';
import { PermessionEnum } from 'src/panel/enums/PermessionsEnum';
import { OrderService } from './order.service';

@Controller('api/Orders')
export class OrderController {
  constructor (private orderService: OrderService) {}

  @Get('Get')
  @PermessionsGuard(PermessionEnum.SHOW_ORDER)
  async Get (
    @Query() query: DataSourceLoadOptionsBase
  ): Promise<UIResponseBase<Order>> {
    const result = await this.orderService.Get(query);
    return result;
  }

  @Post('Insert')
  @PermessionsGuard(PermessionEnum.ADD_ORDER)
  async Insert (@Body() request): Promise<UIResponseBase<Order>> {
    const entity = JSON.parse(request.values) as Order;
    const result = await this.orderService.Insert(entity);
    return result;
  }

  @Post('Update')
  @PermessionsGuard(PermessionEnum.UPDATE_ORDER)
  async Update (
    @Body() request: DxGridUpdateRequest
  ): Promise<UIResponseBase<Order>> {
    const entity = { ...JSON.parse(request.values) } as Order;
    entity.Id = request.key;
    const result = await this.orderService.Update(entity);
    return result;
  }

  @Post('Delete')
  @PermessionsGuard(PermessionEnum.DELETE_ORDER)
  async Delete (
    @Body() deleteRequest: DxGridDeleteRequest
  ): Promise<UIResponseBase<Order>> {
    const result = await this.orderService.Delete(deleteRequest.key);
    return result;
  }
}
