import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, OneToOne, JoinColumn, PrimaryColumn } from "typeorm";
import { ProductStatus } from "../enums/OrderStatus";
import { Order } from "./Order";
import { Product } from "./Product";

@Entity()
export class OrderItem {

    @PrimaryGeneratedColumn()
    Id?: number;

    @Column()
    Amount: number;

    @Column({ type: 'enum', enum: ProductStatus})
    ProductStatus?: string;
    @Column()
    productId?: number;
    @ManyToOne(() => Product, product => product.OrderDetails)
    @JoinColumn()
    Product?: Product;

    @Column({ name: 'orderId' })
    OrderId?: number;
    @ManyToOne(() => Order, order => order.orderItems)
    Order?: Order;

}