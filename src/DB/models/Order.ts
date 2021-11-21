import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany
} from 'typeorm';
import { OrderItem } from './OrderItem';
import { Customer } from './Customer';
import { GetirOrderDetails } from './GetirOrder';
import { TelegramOrder } from './TelegramOrder';
import { OrderChannel } from '../enums/OrderChannel';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  Id?: number;

  @Column({ type: 'nvarchar', length: 36 })
  OrderNo: string;

  @Column({ type: 'enum', enum: OrderChannel })
  OrderChannel: OrderChannel;

  @Column({ type: 'decimal', precision: 8, scale: 2, default: 0 })
  TotalPrice: number;

  @Column({ type: 'smallint', default: 0 })
  OrderStatus?: number;

  @Column({ type: 'datetime' })
  CreateDate: Date;

  @Column({ length: 4000, nullable: true })
  Note?: string;

  @OneToMany(() => OrderItem, order => order.Order, {
    cascade: ['insert', 'update']
  })
  orderItems?: OrderItem[];

  @Column()
  customerId?: number;

  @ManyToOne(() => Customer, customer => customer.Orders, {
    cascade: ['insert'],
    onDelete: 'CASCADE'
  })
  customer?: Customer;

  @Column({ nullable: true })
  telegramOrderId?: number;

  @Column({ nullable: true })
  getirOrderId?: number;

  @OneToOne(() => GetirOrderDetails, getirOrder => getirOrder.Order, {
    cascade: ['insert', 'update'],
    nullable: true,
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'getirOrderId', referencedColumnName: 'id' })
  GetirOrder?: GetirOrderDetails;

  @OneToOne(() => TelegramOrder, telegramOrder => telegramOrder.Order, {
    cascade: ['insert', 'update'],
    nullable: true,
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'telegramOrderId', referencedColumnName: 'id' })
  TelegramOrder?: TelegramOrder;

  OperationItems?: {
    Value: number;
    Text: string;
  }[];
}
