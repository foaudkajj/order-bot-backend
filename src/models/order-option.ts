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

  @Column()
  optionId: number;

  @ManyToOne(() => Option)
  @JoinColumn({name: 'optionId'})
  option?: Option;

  @Column()
  orderItemId?: number;

  @ManyToOne(() => OrderItem, orderItem => orderItem.orderOptions, {
    nullable: false,
    cascade: ['insert'],
    onDelete: 'CASCADE',
  })
  @JoinColumn({name: 'orderItemId'})
  orderItem?: OrderItem;
}
