import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {UserStatus} from '../enums/UserStatus';
import {Merchant} from './Merchant';
import {Role} from './Role';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  Id: number;
  @Column({length: 30, nullable: true})
  UserName: string;
  @Column({type: 'int'})
  UserStatus: UserStatus;
  @Column()
  Password: string;
  @Column({nullable: true})
  ImagePath: string;
  @Column({nullable: true, length: 50})
  Email: string;
  @Column({nullable: true, length: 30})
  Cellphone: string;
  @Column()
  LastSuccesfulLoginDate: Date;
  @Column()
  Salt: string;
  @Column({length: 50})
  Name: string;
  @Column({length: 50})
  LastName: string;
  @Column({name: 'roleId'})
  RoleId: number;
  @ManyToOne(() => Role, role => role.Users)
  Role: Role;
  @Column({name: 'merchantId'})
  MerchantId: number;

  @OneToOne(() => Merchant, merchant => merchant.User, {nullable: true})
  Merchant: Merchant;
}
