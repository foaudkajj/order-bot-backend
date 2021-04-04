import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { Category } from "./Category";
import { Order } from "./Order";
import { OrderDetails } from "./OrderDetails";

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
    @Column({ type: 'decimal', default: 0 })
    UnitPrice?: number;

    @OneToMany(() => OrderDetails, orderDetails => orderDetails.Product)
    OrderDetails: Order[];

    @Column()
    categoryId: string;

    @ManyToOne(() => Category, category => category.Products, { nullable: false, cascade: ['insert'] })
    Category?: Category;
}