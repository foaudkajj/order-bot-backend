import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {Role} from './role';
import {Permession} from './permession';

@Entity()
export class RoleAndPermession {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({name: 'permessionId'})
  PermessionId: number;

  @ManyToOne(
    () => Permession,
    rolePermession => rolePermession.RoleAndPermession,
  )
  Permession: Permession;

  @Column({name: 'roleId'})
  RoleId: number;

  @ManyToOne(() => Role, role => role.RoleAndPermessions)
  Role: Promise<Role>;
}
