import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from "typeorm";
import { Order } from "./Order";
import { TelegramUser } from "./TelegramUser";

@Entity()
export class Product {

    @PrimaryGeneratedColumn()
    Id: number;

    @Column({ length: 15 })
    Type: string;

    @Column()
    ThumbUrl: string;

    @Column({ length: 50 })
    Title: string;

    @Column({ length: 500 })
    Description: string;
    @Column({ length: 50, nullable: true })
    Caption: string;
    @Column({ length: 50 })
    ProductCode: string;
    @Column({ type: 'decimal', nullable: true })
    UnitPrice?: number;

    @OneToMany(() => Order, order => order.Product)
    Orders: Promise<Order[]>;

    // @Column()
    // userId: number;
    // @ManyToOne(() => TelegramUser, user => user.OrderDetails)
    // user: Promise<TelegramUser>;
}