import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import {ProductStatus} from './enums';
import {Order} from './order';
import {OrderOption} from './order-option';
import {Product} from './product';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  amount: number;

  @Column({type: 'nvarchar', length: '2000', nullable: true})
  itemNote?: string;

  @Column({type: 'enum', enum: ProductStatus})
  productStatus?: ProductStatus;

  @Column()
  productId?: number;

  @ManyToOne(() => Product, product => product.orderDetails)
  @JoinColumn({name: 'productId'})
  product?: Product;

  @Column({name: 'orderId'})
  orderId?: number;

  @ManyToOne(() => Order, order => order.orderItems, {onDelete: 'CASCADE'})
  @JoinColumn({name: 'orderId'})
  order?: Order;

  @OneToMany(() => OrderOption, orderOption => orderOption.orderItem, {
    cascade: ['insert', 'update', 'remove'],
  })
  orderOptions?: OrderOption[];
}
