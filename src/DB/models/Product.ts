import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import {Merchant} from '.';
import {Category} from './category';
import {OrderItem} from './order-item';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  Id?: number;

  @Column({length: 15})
  TGQueryResult: string;

  @Column()
  ThumbUrl: string;

  @Column({length: 50})
  Title: string;

  @Column({length: 500})
  Description: string;

  // @Column({length: 50, nullable: true})
  // Caption: string;

  @Column({length: 50})
  ProductCode: string;

  @Column({type: 'decimal', default: 0})
  UnitPrice?: number;

  @OneToMany(() => OrderItem, orderDetails => orderDetails.Product)
  OrderDetails?: OrderItem[];

  @Column()
  categoryId: number;

  @ManyToOne(() => Category, category => category.Products, {
    nullable: false,
    cascade: ['insert'],
  })
  Category?: Category;

  @Column({nullable: true})
  merchantId: number;

  @ManyToOne(() => Merchant, merchant => merchant.products, {
    cascade: ['insert'],
  })
  merchant?: Merchant;

  @Column({type: 'uuid', nullable: true})
  getirProductId: string;
}
