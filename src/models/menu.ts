import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class Menu {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({name: 'menu_key', length: 50})
  menuKey: string;

  @Column({length: 20, nullable: true})
  icon: string;

  @Column({length: 50, nullable: true})
  title: string;

  @Column({length: 200, nullable: true})
  translate: string;

  @Column({length: 300, nullable: true})
  url: string;

  @Column({name: 'parent_id', type: 'nvarchar', length: '50', nullable: true})
  parentId: string;

  @Column({name: 'is_parent'})
  isParent: boolean;

  @Column()
  enabled: boolean;

  @Column()
  priority: number;

  @Column({type: 'nvarchar', length: '50'})
  role: string;
}
