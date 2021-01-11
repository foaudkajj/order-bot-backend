import { Entity, Column, PrimaryColumn, OneToMany } from "typeorm";
import { Order } from "./Order";
import { Product } from "./Product";

@Entity()
export class TelegramUser {

    @PrimaryColumn()
    Id: number;

    @Column({ length: 30, nullable: true })
    Username?: string;

    @Column({ length: 30, nullable: true })
    FirstName?: string;

    @Column({ length: 30, nullable: true })
    LastName?: string;

    @Column({ length: 30, nullable: true })
    PhoneNumber?: string;

    @Column({ type: 'text', nullable: true })
    SelectedProducts?: string;

    @Column({ type: 'text', nullable: true })
    OrderDetails?: string;

    @Column({ length: 1000, nullable: true })
    Address?: string;

    @Column({ length: 1000, nullable: true })
    Location?: string;

    @OneToMany(() => Order, order => order.user, { nullable: true })
    Orders?: Promise<Order[]>;
    // @OneToMany(() => Product, product => product.user, { nullable: true })
    // Products?: Promise<Product[]>;
}