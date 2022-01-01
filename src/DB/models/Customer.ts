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

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({length: 30})
  fullName?: string;

  @Column({length: 30, nullable: true})
  telegramUserName?: string;

  @Column({nullable: true})
  telegramId?: number;

  @Column({length: 30, nullable: true})
  phoneNumber?: string;

  @Column({length: 1000, nullable: true})
  location?: string;

  @Column({length: 1000, nullable: true})
  address?: string;

  @Column({type: 'enum', enum: OrderChannel, nullable: false})
  customerChannel?: string;

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
