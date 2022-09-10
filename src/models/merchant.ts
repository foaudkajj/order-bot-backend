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
  id: number;

  @Column({length: 50, nullable: true})
  botUserName: string;

  @Column({length: 50, nullable: true})
  botToken: string;

  @Column({type: 'boolean', default: true})
  isActive: boolean;

  @Column({length: 50, nullable: true})
  getirAppSecretKey: string;

  @Column({length: 50, nullable: true})
  getirRestaurantSecretKey: string;

  @Column({nullable: true, length: 2000})
  getirAccessToken: string;

  @Column({nullable: true})
  getirTokenLastCreated: Date;

  @Column({length: 50, nullable: true})
  getirRestaurantId: string;

  @Column({length: 50, nullable: true})
  ysAppSecretKey: string;

  @Column({length: 50, nullable: true})
  ysRestaurantSecretKey: string;

  @OneToOne(() => User, user => user.merchant)
  @JoinColumn()
  user: User;

  @OneToMany(() => Product, product => product.merchant)
  products: Product[];

  @OneToMany(() => Customer, customer => customer.merchant)
  customers: Customer[];

  @OneToMany(() => Order, order => order.merchant, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  orders: Order[];

  @OneToMany(() => Category, category => category.merchant)
  categories: Category[];

  // GetirApi: 'https://food-external-api-gateway.getirapi.com/'
  // GetirApi: 'https://food-external-api-gateway.development.getirapi.com/'
}
