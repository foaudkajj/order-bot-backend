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

  @Column({nullable: true})
  thumbUrl: string;

  @Column({length: 50})
  title: string;

  @Column({length: 500})
  description: string;

  // @Column({length: 50, nullable: true})
  // Caption: string;

  @Column({length: 50})
  productCode: string;

  @Column({type: 'decimal', default: 0})
  unitPrice?: number;

  @OneToMany(() => OrderItem, orderDetails => orderDetails.product)
  orderDetails?: OrderItem[];

  @Column()
  categoryId: number;

  @ManyToOne(() => Category, category => category.products, {
    nullable: false,
    cascade: ['insert'],
  })
  @JoinColumn({name: 'categoryId'})
  category?: Category;

  @Column({nullable: true})
  merchantId: number;

  @ManyToOne(() => Merchant, merchant => merchant.products, {
    cascade: ['insert'],
  })
  @JoinColumn({name: 'merchantId'})
  merchant?: Merchant;

  @Column({type: 'uuid', nullable: true})
  getirProductId: string;
}
