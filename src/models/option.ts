import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {OptionCategory} from './option-category';

@Entity()
export class Option {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({length: 500})
  name: string;

  @Column({name: 'getir_option_id', length: 500})
  getirOptionId: string;

  @Column({type: 'decimal', precision: 8, scale: 2, default: 0})
  price: number;

  // @Column({length: 500})
  // getirProductId: string;

  @Column({name: 'option_category_id'})
  optionCategoryId: number;

  @ManyToOne(() => OptionCategory, optionCategory => optionCategory.options, {
    nullable: false,
    cascade: ['insert'],
  })
  @JoinColumn({name: 'option_category_id'})
  optionCategory?: OptionCategory;

  // @Column({name: 'merchantId'})
  // MerchantId: number;

  // @OneToMany(() => OrderOption, orderOption => orderOption.order, {
  //   cascade: ['insert', 'update'],
  //   onDelete: 'CASCADE',
  // })
  // orderOption?: OrderOption;
}
