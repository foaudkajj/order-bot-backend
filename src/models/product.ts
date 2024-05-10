import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import {Merchant} from '.';
import {Category} from './category';
import {OrderItem} from './order-item';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({name: 'thumb_url', nullable: true})
  thumbUrl?: string;

  @Column({length: 50})
  title: string;

  @Column({length: 500})
  description: string;

  // @Column({length: 50, nullable: true})
  // Caption: string;

  @Column({name: 'unit_price', type: 'decimal', precision: 2, default: 0})
  unitPrice?: number;

  @Column({type: 'varchar', nullable: false, length: 6})
  code: string;

  @OneToMany(() => OrderItem, orderDetails => orderDetails.product)
  orderDetails?: OrderItem[];

  @Column({name: 'category_id'})
  categoryId: number;

  @ManyToOne(() => Category, category => category.products, {
    nullable: false,
    cascade: ['insert'],
  })
  @JoinColumn({name: 'category_id'})
  category?: Category;

  @Column({name: 'merchant_id', nullable: true})
  merchantId: number;

  @ManyToOne(() => Merchant, merchant => merchant.products, {
    cascade: ['insert'],
  })
  @JoinColumn({name: 'merchant_id'})
  merchant?: Merchant;

  @Column({name: 'getir_product_id', type: 'uuid', nullable: true})
  getirProductId: string;
}
