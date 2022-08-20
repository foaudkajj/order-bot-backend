import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Category} from 'src/models';
import {Repository} from 'typeorm';
import {BaseRepository} from './base.repository';

@Injectable()
export class CategoryRepository extends BaseRepository<Category> {
  constructor(
    @InjectRepository(Category)
    private _: Repository<Category>,
  ) {
    super();
    this.orm = _;
  }
}
