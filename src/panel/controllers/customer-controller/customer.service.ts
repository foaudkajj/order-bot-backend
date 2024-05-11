import {Injectable} from '@nestjs/common';
import {CustomerRepository} from 'src/db/repositories';
import {Customer} from 'src/models';
import {DataSourceLoadOptionsBase} from 'src/panel/dtos/devextreme-query';
import {UIResponseBase} from 'src/panel/dtos/ui-response-base';

@Injectable()
export class CustomerService {
  constructor(private customerRepository: CustomerRepository) {}

  async get(query: DataSourceLoadOptionsBase, merchantId: number) {
    let customers: Customer[];
    if (query.take && query.skip) {
      customers = await this.customerRepository.orm.find({
        take: query.take,
        skip: query.skip,
        where: {merchantId: merchantId},
      });
    } else {
      customers = await this.customerRepository.orm.find({
        where: {merchantId: merchantId},
      });
    }
    const response: UIResponseBase<Customer[]> = {
      data: customers,
      totalCount: customers.length,
    };
    return response;
  }

  async insert(customer: Customer) {
    const response: UIResponseBase<Customer> = {
      data: customer,
    };

    await this.customerRepository.orm.insert(customer);

    return response;
  }

  async update(updateDetails: Customer) {
    const customer = await this.customerRepository.orm.findOne({
      where: {id: updateDetails.id},
    });
    const {id: _, ...updatedEntity} = {...customer, ...updateDetails};
    await this.customerRepository.orm.update(
      {id: customer.id, merchantId: updateDetails.merchantId},
      updatedEntity,
    );
    return <UIResponseBase<Customer>>{
      data: updatedEntity,
    };
  }

  async delete(Id: number, merchantId: number) {
    await this.customerRepository.orm.delete({
      id: Id,
      merchantId: merchantId,
    });
  }
}
