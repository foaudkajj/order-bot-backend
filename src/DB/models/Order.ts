import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm";
import { Product } from "./Product";
import { TelegramUser } from "./TelegramUser";

@Entity()
export class Order {

    @PrimaryGeneratedColumn()
    Id?: number;

    @Column()
    Amount: number;

    @Column({ length: 4000, nullable: true })
    Description?: string;

    @Column({ type: 'smallint', default: 0 })
    Status?: number;

    @Column({ type: 'datetime' })
    CreateDate: Date;
    @Column()
    userId: number;

    @ManyToOne(() => TelegramUser, user => user.OrderDetails)
    user?: Promise<TelegramUser>;
    @Column()
    productId: number;

    @ManyToOne(() => Product, product => product.Orders)
    @JoinColumn()
    Product?: Product;

}