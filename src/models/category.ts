import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import {Merchant} from './merchant';
import {Product} from './product';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({length: 30})
  name: string;

  @Column({name: 'category_key', length: 50})
  categoryKey: string;

  @OneToMany(() => Product, product => product.category)
  products?: Product[];

  @Column({name: 'merchant_id'})
  merchantId: number;

  @ManyToOne(() => Merchant, merchant => merchant.categories, {
    cascade: ['insert'],
  })
  @JoinColumn({name: 'merchant_id'})
  merchant?: Merchant;

  @Column({name: 'getir_category_id', type: 'uuid', nullable: true})
  getirCategoryId: string;
}
