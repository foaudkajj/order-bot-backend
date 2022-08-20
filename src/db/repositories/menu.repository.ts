import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Menu} from 'src/models';
import {Repository} from 'typeorm';
import {BaseRepository} from './base.repository';

@Injectable()
export class MenuRepository extends BaseRepository<Menu> {
  constructor(
    @InjectRepository(Menu)
    private _: Repository<Menu>,
  ) {
    super();
    this.orm = _;
  }
}
