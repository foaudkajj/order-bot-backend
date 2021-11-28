import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import {OrderItem} from './order-item';
import {Customer} from './customer';
import {GetirOrder} from './getir-order';
import {TelegramOrder} from './telegram-order';
import {OrderChannel} from './enums';
import {Merchant} from './merchant';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  Id?: number;

  @Column({type: 'nvarchar', length: 36})
  OrderNo: string;

  @Column({type: 'enum', enum: OrderChannel})
  OrderChannel: OrderChannel;

  @Column({type: 'decimal', precision: 8, scale: 2, default: 0})
  TotalPrice: number;

  @Column({type: 'smallint', default: 0})
  OrderStatus?: number;

  @Column({type: 'datetime'})
  CreateDate: Date;

  @Column({length: 4000, nullable: true})
  Note?: string;

  @OneToMany(() => OrderItem, order => order.Order, {
    cascade: ['insert', 'update'],
    onDelete: 'CASCADE',
  })
  orderItems?: OrderItem[];

  @Column()
  customerId?: number;

  @ManyToOne(() => Customer, customer => customer.Orders, {
    cascade: ['insert'],
    onDelete: 'CASCADE',
  })
  customer?: Customer;

  @Column({nullable: true})
  telegramOrderId?: number;

  @Column({nullable: true})
  getirOrderId?: number;

  @OneToOne(() => GetirOrder, getirOrder => getirOrder.Order, {
    cascade: ['insert', 'update'],
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({name: 'getirOrderId', referencedColumnName: 'id'})
  GetirOrder?: GetirOrder;

  @ManyToOne(() => TelegramOrder, telegramOrder => telegramOrder.Orders, {
    cascade: ['insert', 'update'],
    nullable: true,
    onDelete: 'CASCADE',
  })
  TelegramOrder?: TelegramOrder;

  @Column()
  merchantId: number;

  @ManyToOne(() => Merchant, merchant => merchant.orders, {
    cascade: ['insert'],
  })
  merchant?: Merchant;

  OperationItems?: {
    Value: number;
    Text: string;
  }[];
}
