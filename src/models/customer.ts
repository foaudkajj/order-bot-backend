import {
  Entity,
  Column,
  OneToMany,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import {Merchant} from '.';
import {OrderChannel} from './enums';
import {Order} from './order';

/**
 * Represents the model of the customers of the system (e.g. a Telegram user).
 */
@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({length: 30})
  fullName?: string;

  @Column({length: 30, nullable: true})
  telegramUserName?: string;

  @Column({name: 'telegram_id', type: 'double', nullable: true})
  telegramId?: number;

  @Column({length: 30, nullable: true})
  phoneNumber?: string;

  @Column({length: 1000, nullable: true})
  location?: string;

  @Column({length: 1000, nullable: true})
  address?: string;

  @Column({type: 'enum', enum: OrderChannel, nullable: false})
  customerChannel?: string;

  @Column({type: 'datetime', name: 'create_date', nullable: false})
  createDate: Date;

  @OneToMany(() => Order, order => order.customer, {nullable: true})
  orders?: Promise<Order[]>;
  // @OneToMany(() => Product, product => product.user, { nullable: true })
  // Products?: Promise<Product[]>;

  @Column()
  merchantId: number;

  @ManyToOne(() => Merchant, merchant => merchant.customers, {
    cascade: ['insert'],
  })
  merchant?: Merchant;
}
