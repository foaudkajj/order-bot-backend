import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {User} from 'src/models/user';
import {DataSourceLoadOptionsBase} from 'src/panel/dtos/devextreme-query';
import {UIResponseBase} from 'src/panel/dtos/ui-response-base';
import * as bcrypt from 'bcrypt';
import {UserRepository} from 'src/db/repositories';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async Get(query: DataSourceLoadOptionsBase) {
    let users: User[];
    if (query.take && query.skip) {
      users = await this.userRepository.orm.find({
        take: query.take,
        skip: query.skip,
      });
    } else {
      users = await this.userRepository.orm.find();
    }
    const response: UIResponseBase<User[]> = {
      data: users,
      totalCount: users.length,
    };
    return response;
  }

  async Insert(user: User) {
    try {
      const response: UIResponseBase<User> = {
        data: user,
      };
      const salt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(user.password, salt);
      user.salt = salt;
      user.password = hash;
      await this.userRepository.orm.insert(user);
      return response;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async Update(updateDetails: User) {
    try {
      const user = await this.userRepository.orm.findOne({
        where: {id: updateDetails.id},
      });
      if (updateDetails.password) {
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(updateDetails.password, salt);
        updateDetails.salt = salt;
        updateDetails.password = hash;
      }
      const {id: _, ...updatedUser} = {...user, ...updateDetails};
      await this.userRepository.orm.update({id: user.id}, updatedUser);
      return <UIResponseBase<User>>{
        data: updatedUser,
      };
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async Delete(Id: number) {
    try {
      await this.userRepository.orm.delete({id: Id});
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
