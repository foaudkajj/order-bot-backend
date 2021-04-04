import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, OneToOne, JoinColumn, PrimaryColumn } from "typeorm";
import { Order } from "./Order";
import { Product } from "./Product";

@Entity()
export class OrderDetails {

    @PrimaryGeneratedColumn()
    Id?: number;

    @Column()
    Amount: number;

    @Column({ type: 'datetime' })
    CreateDate: Date;
    @Column()
    productId?: number;

    @ManyToOne(() => Product, product => product.OrderDetails)
    @JoinColumn()
    Product?: Product;

    @Column({ name: 'orderId' })
    OrderId?: number;

    @ManyToOne(() => Order, order => order.OrderDetails)
    Order?: Order;

}