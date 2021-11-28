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
  Id?: number;

  @Column({length: 30})
  Name: string;

  @Column({length: 50})
  CategoryKey: string;

  @OneToMany(() => Product, product => product.Category)
  Products?: Product[];

  @Column()
  merchantId: number;

  @ManyToOne(() => Merchant, merchant => merchant.categories, {
    cascade: ['insert'],
  })
  merchant?: Merchant;

  @Column({type: 'uuid', nullable: true})
  getirCategoryId: string;
}
