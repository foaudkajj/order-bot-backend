import { Entity, Column, PrimaryColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OrderChannel } from "../enums/OrderChannel";
import { Order } from "./Order";
import { Product } from "./Product";

@Entity()
export class Customer {

    @PrimaryGeneratedColumn()
    Id?: number;

    @Column({ length: 30})
    FullName: string;

    @Column({ length: 30,nullable: true})
    TelegramUserName?: string;
    
    @Column({ nullable: true})
    TelegramId?: number;

    @Column({ length: 30, nullable: true })
    PhoneNumber?: string;

    @Column({type:'enum', enum: OrderChannel, nullable :false})
    CustomerChannel: string;

    @OneToMany(() => Order, order => order.customer, { nullable: true })
    Orders?: Promise<Order[]>;
    // @OneToMany(() => Product, product => product.user, { nullable: true })
    // Products?: Promise<Product[]>;
}