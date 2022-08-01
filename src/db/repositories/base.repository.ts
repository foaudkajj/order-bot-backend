import {Injectable} from '@nestjs/common';
import {ObjectLiteral, Repository} from 'typeorm';

@Injectable()
export class BaseRepository<Entity extends ObjectLiteral> {
  public orm: Repository<Entity>;

  constructor() {}
}
