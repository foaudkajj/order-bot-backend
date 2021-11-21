import {Entity, Column, PrimaryGeneratedColumn, OneToMany} from 'typeorm';
import {Product} from './product';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({length: 30})
  Name: string;

  @Column({length: 50})
  CategoryKey: string;

  @OneToMany(() => Product, product => product.Category)
  Products: Product[];
}
