import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Category {

    @PrimaryGeneratedColumn()
    Id: number;

    @Column({ length: 30 })
    Text: string;

    @Column({ length: 50 })
    ProductKey: string;

}