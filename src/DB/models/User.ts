import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserStatus } from './enums';
import { Merchant } from './merchant';
import { Role } from './role';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 30, nullable: true })
  userName: string;

  @Column({ type: 'int' })
  userStatus: UserStatus;

  @Column()
  password: string;

  @Column({ nullable: true })
  imagePath: string;

  @Column({ nullable: true, length: 50 })
  email: string;

  @Column({ nullable: true, length: 30 })
  cellphone: string;

  @Column()
  lastSuccesfulLoginDate: Date;

  @Column()
  salt: string;

  @Column({ length: 50 })
  name: string;

  @Column({ length: 50 })
  lastName: string;

  @Column({ name: 'roleId' })
  roleId: number;

  @ManyToOne(() => Role, role => role.users)
  role: Role;

  @Column({ name: 'merchantId' })
  merchantId: number;

  @OneToOne(() => Merchant, merchant => merchant.user, { nullable: true })
  merchant: Merchant;
}
