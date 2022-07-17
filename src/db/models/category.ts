import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import {Merchant} from './merchant';
import {Product} from './product';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({length: 30})
  name: string;

  @Column({length: 50})
  categoryKey: string;

  @OneToMany(() => Product, product => product.category)
  products?: Product[];

  @Column()
  merchantId: number;

  @ManyToOne(() => Merchant, merchant => merchant.categories, {
    cascade: ['insert'],
  })
  merchant?: Merchant;

  @Column({type: 'uuid', nullable: true})
  getirCategoryId: string;
}
