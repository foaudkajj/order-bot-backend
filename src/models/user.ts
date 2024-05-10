import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {UserStatus} from './enums';
import {Merchant} from './merchant';
import {Role} from './role';

/**
 * Represents the model of the system users.
 */
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({name: 'user_name', length: 30, nullable: true})
  userName: string;

  @Column({name: 'user_status', type: 'int'})
  userStatus: UserStatus;

  @Column()
  password: string;

  @Column({name: 'image_path', nullable: true})
  imagePath: string;

  @Column({nullable: true, length: 50})
  email: string;

  @Column({nullable: true, length: 30})
  cellphone: string;

  @Column({name: 'last_succesful_login_date'})
  lastSuccesfulLoginDate: Date;

  @Column()
  salt: string;

  @Column({length: 50})
  name: string;

  @Column({name: 'last_name', length: 50})
  lastName: string;

  @Column({name: 'role_id'})
  roleId: number;

  @ManyToOne(() => Role, role => role.users)
  @JoinColumn({name: 'role_id'})
  role: Role;

  @Column({name: 'merchant_id'})
  merchantId: number;

  @OneToOne(() => Merchant, {nullable: true})
  @JoinColumn({name: 'merchant_id'})
  merchant: Merchant;
}
