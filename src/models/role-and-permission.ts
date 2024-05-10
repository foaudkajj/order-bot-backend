import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {Permission, Role} from '.';

@Entity()
export class RoleAndPermission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({name: 'permission_id'})
  permissionId: number;

  @ManyToOne(
    () => Permission,
    rolePermission => rolePermission.roleAndPermissions,
  )
  @JoinColumn({name: 'permission_id'})
  permission: Permission;

  @Column({name: 'role_id'})
  roleId: number;

  @ManyToOne(() => Role, role => role.roleAndPermissions)
  @JoinColumn({name: 'role_id'})
  role: Promise<Role>;
}
