import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import {ProductStatus} from './enums';
import {Order} from './order';
import {Product} from './product';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  amount: number;

  @Column({type: 'nvarchar', length: '2000'})
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

  @ManyToOne(() => Order, order => order.orderItems)
  @JoinColumn({name: 'orderId'})
  order?: Order;
}
