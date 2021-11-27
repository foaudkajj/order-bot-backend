import {Injectable} from '@nestjs/common';
import {User} from 'src/db/models/user';
import {DataSourceLoadOptionsBase} from 'src/panel/dtos/devextreme-query';
import {UIResponseBase} from 'src/panel/dtos/ui-response-base';
import {Repository} from 'typeorm';
import * as bcrypt from 'bcrypt';
import {InjectRepository} from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async Get(query: DataSourceLoadOptionsBase) {
    let users: User[];
    if (query.take && query.skip) {
      users = await this.userRepository.find({
        take: query.take,
        skip: query.skip,
      });
    } else {
      users = await this.userRepository.find();
    }
    const response: UIResponseBase<User> = {
      IsError: false,
      data: users,
      totalCount: users.length,
      MessageKey: 'SUCCESS',
      StatusCode: 200,
    };
    return response;
  }

  async Insert(user: User) {
    try {
      const response: UIResponseBase<User> = {
        IsError: false,
        Result: user,
        MessageKey: 'SUCCESS',
        StatusCode: 200,
      };
      const salt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(user.Password, salt);
      user.Salt = salt;
      user.Password = hash;
      await this.userRepository.insert(user);
      return response;
    } catch (error) {
      throw <UIResponseBase<User>>{
        IsError: true,
        MessageKey: 'ERROR',
        StatusCode: 500,
      };
    }
  }

  async Update(updateDetails: User) {
    try {
      const user = await this.userRepository.findOne({
        where: {Id: updateDetails.Id},
      });
      if (updateDetails.Password) {
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(updateDetails.Password, salt);
        updateDetails.Salt = salt;
        updateDetails.Password = hash;
      }
      const {Id, ...updatedUser} = {...user, ...updateDetails};
      await this.userRepository.update({Id: user.Id}, updatedUser);
      return <UIResponseBase<User>>{
        IsError: false,
        Result: updatedUser,
        MessageKey: 'SUCCESS',
        StatusCode: 200,
      };
    } catch (error) {
      throw <UIResponseBase<User>>{
        IsError: true,
        MessageKey: 'ERROR',
        StatusCode: 500,
      };
    }
  }

  async Delete(Id: number) {
    try {
      await this.userRepository.delete({Id: Id});
      return <UIResponseBase<User>>{
        IsError: false,
        MessageKey: 'SUCCESS',
        StatusCode: 200,
      };
    } catch (error) {
      console.log(error);
      throw <UIResponseBase<User>>{
        IsError: true,
        MessageKey: 'ERROR',
        StatusCode: 500,
      };
    }
  }
}
