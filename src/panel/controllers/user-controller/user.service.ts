import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {User} from 'src/models/user';
import {DataSourceLoadOptionsBase} from 'src/panel/dtos/devextreme-query';
import {UIResponseBase} from 'src/panel/dtos/ui-response-base';
import * as bcrypt from 'bcrypt';
import {UserRepository} from 'src/db/repositories';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async get(query: DataSourceLoadOptionsBase, merchantId: number) {
    let users: User[];
    if (query.take && query.skip) {
      users = await this.userRepository.orm.find({
        take: query.take,
        skip: query.skip,
        where: {merchantId: merchantId},
      });
    } else {
      users = await this.userRepository.orm.find({
        where: {merchantId: merchantId},
      });
    }
    const response: UIResponseBase<User[]> = {
      data: users,
      totalCount: users.length,
    };
    return response;
  }

  async insert(user: User) {
    const response: UIResponseBase<User> = {
      data: user,
    };
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(user.password, salt);
    user.salt = salt;
    user.password = hash;
    await this.userRepository.orm.insert(user);
    return response;
  }

  async update(updateDetails: User) {
    delete updateDetails.merchantId;
    delete updateDetails.merchant;
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
  }

  async delete(Id: number, merchantId: number) {
    const merchantUsers = await this.userRepository.orm.find({
      where: {merchantId: merchantId},
    });

    if (!merchantUsers || !merchantUsers.length) {
      throw new HttpException(
        'ERROR.MERCHANT_USER_NOT_FOUND',
        HttpStatus.BAD_REQUEST,
      );
    }
    // if the current merchant has only one account, dont allow it to be deleted.
    else if (merchantUsers.length === 1) {
      throw new HttpException(
        'ERROR.MERCHANT_LAST_USER',
        HttpStatus.BAD_REQUEST,
      );
    } else {
      await this.userRepository.orm.delete({id: Id, merchantId: merchantId});
    }
  }
}
