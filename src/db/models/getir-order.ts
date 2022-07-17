import {Entity, Column, OneToOne, PrimaryColumn} from 'typeorm';
import {Order} from './order';

@Entity()
export class GetirOrder {
  @PrimaryColumn()
  id?: string;

  @Column()
  status: number;

  @Column()
  isScheduled: boolean;

  @Column()
  confirmationId: string;

  @Column()
  clientId: string;

  @Column()
  clientName: string;

  @Column()
  clientContactPhoneNumber: string;

  @Column()
  clientPhoneNumber: string;

  @Column()
  clientDeliveryAddressId: string;

  @Column()
  clientDeliveryAddress: string;

  @Column()
  clientCity: string;

  @Column()
  clientDistrict: string;

  @Column()
  clientLocation: string;

  @Column()
  courierId: string;

  @Column()
  courierStatus: number;

  @Column()
  courierName: string;

  @Column()
  courierLocation: string;

  @Column({type: 'varchar', length: '4000'})
  clientNote: string;

  @Column()
  doNotKnock: boolean;

  @Column()
  dropOffAtDoor: boolean;

  @Column()
  totalPrice: number;

  @Column()
  checkoutDate: string;

  @Column()
  deliveryType: number;

  @Column()
  isEcoFriendly: boolean;

  @Column()
  paymentMethodId: number;

  @Column()
  paymentMethodText: string;

  @Column()
  restaurantId: string;

  @Column({name: 'orderId', nullable: true})
  OrderId?: number;

  @OneToOne(() => Order, order => order.getirOrder)
  Order?: Order;
}
