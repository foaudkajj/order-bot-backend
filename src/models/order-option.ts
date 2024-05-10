import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {OrderItem, Option} from '.';

@Entity()
export class OrderOption {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({type: 'decimal', precision: 2, default: 0})
  price: number;

  @Column({name: 'option_id'})
  optionId: number;

  @ManyToOne(() => Option)
  @JoinColumn({name: 'option_id'})
  option?: Option;

  @Column({name: 'order_item_id'})
  orderItemId?: number;

  @ManyToOne(() => OrderItem, orderItem => orderItem.orderOptions, {
    nullable: false,
    cascade: ['insert'],
    onDelete: 'CASCADE',
  })
  @JoinColumn({name: 'order_item_id'})
  orderItem?: OrderItem;
}
