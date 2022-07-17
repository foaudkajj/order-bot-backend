import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Permission, Role } from '.';


@Entity()
export class RoleAndPermission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'permissionId' })
  permissionId: number;

  @ManyToOne(
    () => Permission,
    rolePermission => rolePermission.roleAndPermissions,
  )
  permission: Permission;

  @Column({ name: 'roleId' })
  roleId: number;

  @ManyToOne(() => Role, role => role.roleAndPermissions)
  role: Promise<Role>;
}
