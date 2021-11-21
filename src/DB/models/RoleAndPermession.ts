import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from './Role';
import { Permession } from './Permession';

@Entity()
export class RoleAndPermession {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ name: 'permessionId' })
  PermessionId: number;

  @ManyToOne(
    () => Permession,
    rolePermession => rolePermession.RoleAndPermession
  )
  Permession: Permession;

  @Column({ name: 'roleId' })
  RoleId: number;

  @ManyToOne(() => Role, role => role.RoleAndPermessions)
  Role: Promise<Role>;
}
