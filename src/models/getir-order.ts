import {Entity, Column, OneToOne, PrimaryColumn} from 'typeorm';
import {Order} from './order';

@Entity()
export class GetirOrder {
  @PrimaryColumn()
  id?: string;

  @Column()
  status: number;

  @Column({name: 'is_scheduled'})
  isScheduled: boolean;

  @Column({name: 'confirmation_id'})
  confirmationId: string;

  @Column({name: 'client_id'})
  clientId: string;

  @Column({name: 'client_name'})
  clientName: string;

  @Column({name: 'client_contact_phone_number'})
  clientContactPhoneNumber: string;

  @Column({name: 'client_phone_number'})
  clientPhoneNumber: string;

  @Column({name: 'client_delivery_address_id'})
  clientDeliveryAddressId: string;

  @Column({name: 'client_delivery_address'})
  clientDeliveryAddress: string;

  @Column({name: 'client_city'})
  clientCity: string;

  @Column({name: 'client_district'})
  clientDistrict: string;

  @Column({name: 'client_location'})
  clientLocation: string;

  @Column({name: 'courier_id'})
  courierId: string;

  @Column({name: 'courier_status'})
  courierStatus: number;

  @Column({name: 'courier_name'})
  courierName: string;

  @Column({name: 'courier_location'})
  courierLocation: string;

  @Column({name: 'client_note', type: 'varchar', length: '4000'})
  clientNote: string;

  @Column({name: 'do_not_knock'})
  doNotKnock: boolean;

  @Column({name: 'drop_off_at_door'})
  dropOffAtDoor: boolean;

  @Column({name: 'total_price'})
  totalPrice: number;

  @Column({name: 'checkout_date'})
  checkoutDate: string;

  @Column({name: 'delivery_type'})
  deliveryType: number;

  @Column({name: 'is_eco_friendly'})
  isEcoFriendly: boolean;

  @Column({name: 'payment_method_id'})
  paymentMethodId: number;

  @Column({name: 'payment_method_text'})
  paymentMethodText: string;

  @Column({name: 'restaurant_id'})
  restaurantId: string;

  @Column({name: 'order_id', nullable: true})
  OrderId?: number;

  @OneToOne(() => Order, order => order.getirOrder)
  Order?: Order;
}
