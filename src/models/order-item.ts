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

  @Column({name: 'item_note', type: 'nvarchar', length: '2000', nullable: true})
  itemNote?: string;

  @Column({name: 'product_status', type: 'enum', enum: ProductStatus})
  productStatus?: ProductStatus;

  @Column({name: 'product_id'})
  productId?: number;

  @ManyToOne(() => Product, product => product.orderDetails)
  @JoinColumn({name: 'product_id'})
  product?: Product;

  @Column({name: 'order_id'})
  orderId?: number;

  @ManyToOne(() => Order, order => order.orderItems, {onDelete: 'CASCADE'})
  @JoinColumn({name: 'order_id'})
  order?: Order;

  @OneToMany(() => OrderOption, orderOption => orderOption.orderItem, {
    cascade: ['insert', 'update', 'remove'],
  })
  orderOptions?: OrderOption[];
}
