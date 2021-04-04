import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany, PrimaryColumn } from "typeorm";
import { OrderDetails } from "./OrderDetails";
import { Customer } from "./Customer";

@Entity()
export class Order {

    @PrimaryGeneratedColumn()
    Id?: number;
    @Column({ type: 'nvarchar' })
    OrderNo: string;
    @Column({ type: 'decimal', precision: 8, scale: 2, default: 0 })
    TotalPrice: number;

    @Column({ type: 'smallint', default: 0 })
    OrderStatus?: number;

    @Column({ type: 'datetime' })
    CreateDate: Date;
    @Column({ length: 4000, nullable: true })
    Description?: string;
    @Column({ nullable: true })
    customerId: number;

    @ManyToOne(() => Customer, customer => customer.Orders, { cascade: ['insert'] })
    customer?: Customer;

    @OneToMany(() => OrderDetails, order => order.Order, { cascade: ['insert'] })
    OrderDetails?: OrderDetails[];

}