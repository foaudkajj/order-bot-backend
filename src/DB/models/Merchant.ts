import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {Category, Customer, Order, Product} from '.';
import {User} from './user';

@Entity()
export class Merchant {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({length: 50, nullable: true})
  botUserName: string;

  @Column({length: 50, nullable: true})
  botToken: string;

  @Column({type: 'boolean', default: true})
  isActive: boolean;

  @Column({length: 50, nullable: true})
  GetirAppSecretKey: string;

  @Column({length: 50, nullable: true})
  GetirRestaurantSecretKey: string;

  @Column({nullable: true, length: 2000})
  GetirAccessToken: string;

  @Column({nullable: true})
  GetirTokenLastCreated: Date;

  @Column({length: 50, nullable: true})
  GetirRestaurantId: string;

  @Column({length: 50, nullable: true})
  YSAppSecretKey: string;

  @Column({length: 50, nullable: true})
  YSRestaurantSecretKey: string;

  @Column({name: 'userId'})
  UserId: number;

  @OneToOne(() => User, user => user.Merchant)
  @JoinColumn()
  User: User;

  @OneToMany(() => Product, product => product.merchant)
  products: Product[];

  @OneToMany(() => Customer, customer => customer.merchant)
  customers: Customer[];

  @OneToMany(() => Order, order => order.merchant)
  orders: Order[];

  @OneToMany(() => Category, category => category.merchant)
  categories: Category[];

  // GetirApi: 'https://food-external-api-gateway.getirapi.com/'
  // GetirApi: 'https://food-external-api-gateway.development.getirapi.com/'
}
