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
  Id?: number;

  @Column()
  Amount: number;

  @Column({type: 'enum', enum: ProductStatus})
  ProductStatus?: string;

  @Column()
  productId?: number;

  @ManyToOne(() => Product, product => product.OrderDetails)
  @JoinColumn()
  Product?: Product;

  @Column({name: 'orderId'})
  OrderId?: number;

  @ManyToOne(() => Order, order => order.orderItems)
  Order?: Order;
}
