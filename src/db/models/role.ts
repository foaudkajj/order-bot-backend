import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user';
import { RoleAndPermission } from './role-and-permission';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  roleName: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(
    () => RoleAndPermission,
    roleAndPermission => roleAndPermission.role,
  )
  roleAndPermissions: RoleAndPermission[];

  @OneToMany(() => User, pnaleUser => pnaleUser.role)
  users: User[];
}
