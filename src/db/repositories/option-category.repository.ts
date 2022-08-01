import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {OptionCategory} from 'src/db/models';
import {Repository} from 'typeorm';
import {BaseRepository} from './base.repository';

@Injectable()
export class OptionCategoryRepository extends BaseRepository<OptionCategory> {
  constructor(
    @InjectRepository(OptionCategory)
    private _: Repository<OptionCategory>,
  ) {
    super();
    this.orm = _;
  }
}
