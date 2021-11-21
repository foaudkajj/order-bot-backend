import {Injectable} from '@nestjs/common';
import {Permession} from 'src/DB/models/permession';
import {Role} from 'src/DB/models/role';
import {RoleAndPermession} from 'src/DB/models/role-and-permession';
import {DataSourceLoadOptionsBase} from 'src/panel/dtos/devextreme-query';
import {GetRolesDto} from 'src/panel/dtos/get-roles-dto';
import {RoleIdAndPermessions} from 'src/panel/dtos/role-id-and-permessions';
import {UIResponseBase} from 'src/panel/dtos/ui-response-base';
import {getManager, getRepository} from 'typeorm';

@Injectable()
export class RoleService {
  constructor() {}

  async GetRoles(query: DataSourceLoadOptionsBase) {
    let roles: Role[];
    if (query.take && query.skip) {
      roles = await getRepository(Role).find({
        take: query.take,
        skip: query.skip,
        relations: ['RoleAndPermessions', 'RoleAndPermessions.Permession'],
      });
    } else {
      roles = await getRepository(Role).find({
        relations: ['RoleAndPermessions', 'RoleAndPermessions.Permession'],
      });
    }
    const result = roles.map(
      mp =>
        <GetRolesDto>{
          Id: mp.Id,
          Description: mp.Description,
          RoleName: mp.RoleName,
          RolePermessionsIds: mp.RoleAndPermessions.map(
            mpp => mpp.Permession.PermessionKey,
          ),
        },
    );
    const response: UIResponseBase<GetRolesDto> = {
      IsError: false,
      data: result,
      totalCount: result.length,
      MessageKey: 'SUCCESS',
      StatusCode: 200,
    };
    return response;
  }

  async GetPermessions(query: DataSourceLoadOptionsBase) {
    let result;
    if (query.take && query.skip) {
      result = await getRepository(Permession).find({
        take: query.take,
        skip: query.skip,
      });
    } else {
      result = await getRepository(Permession).find();
    }
    const response: UIResponseBase<Permession> = {
      IsError: false,
      data: result,
      totalCount: result.length,
      MessageKey: 'SUCCESS',
      StatusCode: 200,
    };
    return response;
  }

  async SaveRolePermessions(roleIdAndPermessions: RoleIdAndPermessions) {
    try {
      await getManager().transaction(async transactionalEntityManager => {
        await transactionalEntityManager.delete(RoleAndPermession, {
          RoleId: roleIdAndPermessions.roleId,
        });
        await transactionalEntityManager.insert(
          RoleAndPermession,
          roleIdAndPermessions.rolePermessions.map(
            mp =>
              <RoleAndPermession>{
                RoleId: roleIdAndPermessions.roleId,
                PermessionId: mp,
              },
          ),
        );
      });
      return <UIResponseBase<Permession>>{
        IsError: false,
        MessageKey: 'SUCCESS',
        StatusCode: 200,
      };
    } catch (error) {
      console.log(error);
      return <UIResponseBase<Permession>>{
        IsError: true,
        MessageKey: 'ERROR',
        StatusCode: 500,
      };
    }
  }

  async Insert(role: Role) {
    try {
      const response: UIResponseBase<Role> = {
        IsError: false,
        Result: role,
        MessageKey: 'SUCCESS',
        StatusCode: 200,
      };
      await getRepository(Role).insert(role);
      return response;
    } catch (error) {
      console.log(error);
      throw <UIResponseBase<Role>>{
        IsError: true,
        MessageKey: 'ERROR',
        StatusCode: 500,
      };
    }
  }

  async Update(updateDetails: Role) {
    try {
      const role = await getRepository(Role).findOne({
        where: {Id: updateDetails.Id},
      });
      const {Id, ...updatedRole} = {...role, ...updateDetails};
      await getRepository(Role).update({Id: role.Id}, updatedRole);
      return <UIResponseBase<Role>>{
        IsError: false,
        Result: updatedRole,
        MessageKey: 'SUCCESS',
        StatusCode: 200,
      };
    } catch (error) {
      console.log(error);
      throw <UIResponseBase<Role>>{
        IsError: true,
        MessageKey: 'ERROR',
        StatusCode: 500,
      };
    }
  }

  async Delete(Id: number) {
    try {
      await getRepository(Role).delete({Id: Id});
      return <UIResponseBase<Role>>{
        IsError: false,
        MessageKey: 'SUCCESS',
        StatusCode: 200,
      };
    } catch (error) {
      console.log(error);
      throw <UIResponseBase<Role>>{
        IsError: true,
        MessageKey: 'ERROR',
        StatusCode: 500,
      };
    }
  }
}
