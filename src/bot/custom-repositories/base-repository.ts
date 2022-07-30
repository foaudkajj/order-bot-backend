import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {ObjectLiteral, Repository} from 'typeorm';

@Injectable()
export class BaseRepository<Entity extends ObjectLiteral> {
  public orm: Repository<Entity>;

  constructor() {}
}
