import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {OrderItem} from 'src/models';
import {FindOptionsRelations, Repository} from 'typeorm';
import {BaseRepository} from './base.repository';

@Injectable()
export class OrderItemRepository extends BaseRepository<OrderItem> {
  constructor(
    @InjectRepository(OrderItem)
    private _: Repository<OrderItem>,
  ) {
    super();
    this.orm = _;
  }

  /**
   * Returns the order items of the provided order id.
   * @param {number} orderId: The id of the order
   * @param {FindOptionsRelations<OrderItem>} relations: The relations of the order items to include in the order.
   * @returns {Promise<OrderItem[]>} The order items of the provided order.
   */
  getOrderItems(
    orderId: number,
    relations?: FindOptionsRelations<OrderItem>,
  ): Promise<OrderItem[]> {
    return this.orm.find({
      where: {orderId: orderId},
      relations: relations ?? {},
    });
  }
}
