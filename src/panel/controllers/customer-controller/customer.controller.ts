import {Controller, Get, Post, Query, Body, Request} from '@nestjs/common';
import {Customer} from 'src/models';
import {DataSourceLoadOptionsBase} from 'src/panel/dtos/devextreme-query';
import {DxGridDeleteRequest} from 'src/panel/dtos/dx-grid-delete.request';
import {DxGridUpdateRequest} from 'src/panel/dtos/dx-grid-update.request';
import {UIResponseBase} from 'src/panel/dtos/ui-response-base';
import {CustomerService} from './customer.service';
import {PermissionEnum} from 'src/panel/enums/permissions-enum';
import {PermissionsGuard} from 'src/panel/decorators/permissions.decorator';

@Controller('api/customer')
export class CustomerController {
  constructor(private customerService: CustomerService) {}

  @Get('get')
  @PermissionsGuard(PermissionEnum.SHOW_CUSTOMER)
  async Get(
    @Query() query: DataSourceLoadOptionsBase,
    @Request() request,
  ): Promise<UIResponseBase<Customer[]>> {
    const result = await this.customerService.get(query, request.merchantId);
    return result;
  }

  @Post('insert')
  @PermissionsGuard(PermissionEnum.ADD_CUSTOMER)
  async Insert(
    @Body() body,
    @Request() request,
  ): Promise<UIResponseBase<Customer>> {
    const entity = JSON.parse(body.values) as Customer;
    if (entity) {
      entity.merchantId = request.merchantId;
    }
    const result = await this.customerService.insert(entity);
    return result;
  }

  @Post('update')
  @PermissionsGuard(PermissionEnum.UPDATE_CUSTOMER)
  async Update(
    @Body() body: DxGridUpdateRequest,
    @Request() request,
  ): Promise<UIResponseBase<Customer>> {
    const entity = {...JSON.parse(body.values)} as Customer;
    entity.id = body.key;
    entity.merchantId = request.merchantId;
    const result = await this.customerService.update(entity);
    return result;
  }

  @Post('delete')
  @PermissionsGuard(PermissionEnum.DELETE_CUSTOMER)
  async Delete(
    @Body() deleteRequest: DxGridDeleteRequest,
    @Request() request,
  ): Promise<void> {
    return this.customerService.delete(deleteRequest.key, request.merchantId);
  }
}
