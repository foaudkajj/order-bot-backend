import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Option} from 'src/models';
import {Repository} from 'typeorm';
import {BaseRepository} from './base.repository';

@Injectable()
export class OptionRepository extends BaseRepository<Option> {
  constructor(
    @InjectRepository(Option)
    private _: Repository<Option>,
  ) {
    super();
    this.orm = _;
  }
}
