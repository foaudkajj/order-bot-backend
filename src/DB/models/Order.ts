import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany, PrimaryColumn } from "typeorm";
import { OrderDetails } from "./OrderDetails";
import { TelegramUser } from "./TelegramUser";

@Entity()
export class Order {

    @PrimaryColumn({ type: 'uuid' })
    Id: string;

    @Column({ type: 'smallint', default: 0 })
    Status?: number;

    @Column({ type: 'datetime' })
    CreateDate: Date;
    @Column({ length: 4000, nullable: true })
    Description?: string;
    @Column()
    userId: number;

    @ManyToOne(() => TelegramUser, user => user.Orders)
    user?: TelegramUser;

    @OneToMany(() => OrderDetails, order => order.Order)
    OrderDetails?: OrderDetails[];

}