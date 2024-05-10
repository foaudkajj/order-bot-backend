import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Option} from './option';

@Entity()
export class OptionCategory {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({length: 500})
  name: string;

  @Column({name: 'getir_option_category_id', length: 500})
  getirOptionCategoryId?: string;

  @OneToMany(() => Option, option => option.optionCategory, {cascade: true})
  options?: Option;
}
