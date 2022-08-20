import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {OrderItem} from 'src/models';
import {Repository} from 'typeorm';
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
}
