import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {Category, Customer, Order, Product} from '.';

@Entity()
export class Merchant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({name: 'bot_user_name', length: 50, nullable: true})
  botUserName: string;

  @Column({name: 'bot_token', length: 50, nullable: true})
  botToken: string;

  @Column({name: 'is_active', type: 'boolean', default: true})
  isActive: boolean;

  @Column({name: 'getir_app_secret_key', length: 50, nullable: true})
  getirAppSecretKey: string;

  @Column({name: 'getir_restaurant_secret_key', length: 50, nullable: true})
  getirRestaurantSecretKey: string;

  @Column({name: 'getir_access_token', nullable: true, length: 2000})
  getirAccessToken: string;

  @Column({name: 'getir_token_last_created', nullable: true})
  getirTokenLastCreated: Date;

  @Column({name: 'getir_restaurant_id', length: 50, nullable: true})
  getirRestaurantId: string;

  @Column({name: 'ys_app_secret_key', length: 50, nullable: true})
  ysAppSecretKey: string;

  @Column({name: 'ys_restaurant_secret_key', length: 50, nullable: true})
  ysRestaurantSecretKey: string;

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
