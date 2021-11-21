import {Column, PrimaryGeneratedColumn} from 'typeorm';
import {Status} from '../enums/Status';

export class IStandardModel {
  @PrimaryGeneratedColumn()
  Id: number;
  @Column({type: 'int'})
  StatusId?: Status;
  @Column({type: 'int'})
  CreaUserId?: number;
  @Column({type: 'datetime'})
  CreaDate?: Date;
  @Column({type: 'int'})
  ModifUserId?: number;
  @Column({type: 'datetime'})
  ModifDate?: Date;
}
