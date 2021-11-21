import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';
import { User } from './User';
import { RoleAndPermession } from './RoleAndPermession';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column()
  RoleName: string;

  @Column({ nullable: true })
  Description: string;

  @OneToMany(
    () => RoleAndPermession,
    roleAndPermession => roleAndPermession.Role
  )
  RoleAndPermessions: RoleAndPermession[];

  @OneToMany(() => User, pnaleUser => pnaleUser.Role)
  Users: User[];
}
