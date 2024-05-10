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
import {OrderChannel, OrderStatus, PaymentMethod} from './enums';
import {Merchant} from './merchant';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({name: 'order_no', type: 'nvarchar', length: 36})
  orderNo: string;

  @Column({name: 'order_channel', type: 'enum', enum: OrderChannel})
  orderChannel: OrderChannel;

  @Column({name: 'payment_method', type: 'enum', enum: PaymentMethod})
  paymentMethod: PaymentMethod;

  @Column({
    name: 'total_price',
    type: 'decimal',
    precision: 8,
    scale: 2,
    default: 0,
  })
  totalPrice: number;

  @Column({
    name: 'order_status',
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.New,
  })
  orderStatus?: OrderStatus;

  @Column({name: 'create_date', type: 'datetime'})
  createDate: Date;

  @Column({length: 4000, nullable: true})
  note?: string;

  @Column({length: 4000, nullable: true, name: 'cancel_reason'})
  cancelReason?: string;

  @OneToMany(() => OrderItem, order => order.order, {
    cascade: ['insert', 'update', 'remove'],
    onDelete: 'CASCADE',
  })
  orderItems?: OrderItem[];

  @Column({name: 'customer_id'})
  customerId?: number;

  @ManyToOne(() => Customer, customer => customer.orders, {
    cascade: ['insert', 'update'],
    onDelete: 'CASCADE',
  })
  @JoinColumn({name: 'customer_id'})
  customer?: Customer;

  // @Column({nullable: true})
  // telegramOrderId?: number;

  @Column({name: 'getir_order_id', nullable: true})
  getirOrderId?: string;

  @OneToOne(() => GetirOrder, getirOrder => getirOrder.Order, {
    cascade: ['insert', 'update', 'remove'],
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({name: 'getir_order_id', referencedColumnName: 'id'})
  getirOrder?: GetirOrder;

  // @ManyToOne(() => TelegramOrder, telegramOrder => telegramOrder.Orders, {
  //   cascade: ['insert', 'update'],
  //   nullable: true,
  //   onDelete: 'CASCADE',
  // })
  // @JoinColumn({name: 'telegramOrderId', referencedColumnName: 'id'})
  // TelegramOrder?: TelegramOrder;

  @Column({name: 'merchant_id'})
  merchantId: number;

  @ManyToOne(() => Merchant, merchant => merchant.orders, {
    cascade: ['insert', 'update', 'remove'],
    onDelete: 'CASCADE',
  })
  @JoinColumn({name: 'merchant_id'})
  merchant?: Merchant;

  // @OneToMany(() => OrderOption, orderOption => orderOption.order, {
  //   cascade: ['insert', 'update'],
  //   onDelete: 'CASCADE',
  // })
  // orderOptions?: OrderOption[];
}
