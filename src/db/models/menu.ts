import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Menu {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  menuKey: string;

  @Column({ length: 20, nullable: true })
  icon: string;

  @Column({ length: 50, nullable: true })
  title: string;

  @Column({ length: 200, nullable: true })
  translate: string;

  @Column({ length: 300, nullable: true })
  url: string;

  @Column({ type: 'nvarchar', length: '50', nullable: true })
  parentId: string;

  @Column()
  isParent: boolean;

  @Column()
  priority: number;
}
