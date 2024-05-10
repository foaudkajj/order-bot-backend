import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {Menu} from './menu';
import {RoleAndPermission} from './role-and-permission';

@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({name: 'permission_key'})
  permissionKey: string;

  @Column({name: 'parent_key', type: 'nvarchar', length: 50, nullable: true})
  parentKey: string;

  @Column({name: 'is_parent', type: 'boolean'})
  isParent: string;

  @OneToMany(
    () => RoleAndPermission,
    roleAndPermission => roleAndPermission.permission,
  )
  roleAndPermissions: RoleAndPermission[];
}
