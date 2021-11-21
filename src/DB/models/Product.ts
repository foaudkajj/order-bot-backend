import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import {Category} from './category';
import {OrderItem} from './order-item';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({length: 15})
  Type: string;

  @Column()
  ThumbUrl: string;

  @Column({length: 50})
  Title: string;

  @Column({length: 500})
  Description: string;

  @Column({length: 50, nullable: true})
  Caption: string;

  @Column({length: 50})
  ProductCode: string;

  @Column({type: 'decimal', default: 0})
  UnitPrice?: number;

  @OneToMany(() => OrderItem, orderDetails => orderDetails.Product)
  OrderDetails: OrderItem[];

  @Column()
  categoryId: string;

  @ManyToOne(() => Category, category => category.Products, {
    nullable: false,
    cascade: ['insert'],
  })
  Category?: Category;
}
