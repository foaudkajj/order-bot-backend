import {Column, Entity, OneToOne, PrimaryGeneratedColumn} from 'typeorm';
import {Permession} from './Permession';

@Entity()
export class Menu {
  @PrimaryGeneratedColumn()
  Id: number;
  @Column({length: 50})
  MenuKey: string;
  @Column({length: 20, nullable: true})
  Icon: string;
  @Column({length: 50, nullable: true})
  Title: string;
  @Column({length: 200, nullable: true})
  Translate: string;
  @Column({length: 300, nullable: true})
  URL: string;
  @Column({type: 'nvarchar', length: '50', nullable: true})
  ParentId: string;
  @Column()
  IsParent: boolean;
  @Column()
  Priority: number;
}
