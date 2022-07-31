import {Injectable} from '@nestjs/common';
import {PermissionRepository, RoleRepository} from 'src/bot/repositories';
import {Permission} from 'src/db/models/permission';
import {Role} from 'src/db/models/role';
import {RoleAndPermission} from 'src/db/models/role-and-permission';
import {DataSourceLoadOptionsBase} from 'src/panel/dtos/devextreme-query';
import {GetRolesDto} from 'src/panel/dtos/get-roles-dto';
import {RoleIdAndPermissions} from 'src/panel/dtos/role-id-and-permissions';
import {UIResponseBase} from 'src/panel/dtos/ui-response-base';
import {getManager} from 'typeorm';

@Injectable()
export class RoleService {
  constructor(
    private permissionRepository: PermissionRepository,
    private roleRepository: RoleRepository,
  ) {}

  async GetRoles(query: DataSourceLoadOptionsBase) {
    let roles: Role[];
    if (query.take && query.skip) {
      roles = await this.roleRepository.orm.find({
        take: query.take,
        skip: query.skip,
        relations: ['roleAndPermissions', 'roleAndPermissions.permission'],
      });
    } else {
      roles = await this.roleRepository.orm.find({
        relations: ['roleAndPermissions', 'roleAndPermissions.permission'],
      });
    }
    const result = roles.map(
      mp =>
        <GetRolesDto>{
          id: mp.id,
          description: mp.description,
          roleName: mp.roleName,
          rolePermissionsIds: mp.roleAndPermissions.map(
            mpp => mpp.permission.permissionKey,
          ),
        },
    );
    const response: UIResponseBase<GetRolesDto> = {
      isError: false,
      data: result,
      totalCount: result.length,
      messageKey: 'SUCCESS',
      statusCode: 200,
    };
    return response;
  }

  async GetPermissions(query: DataSourceLoadOptionsBase) {
    let result;
    if (query.take && query.skip) {
      result = await this.permissionRepository.orm.find({
        take: query.take,
        skip: query.skip,
      });
    } else {
      result = await this.permissionRepository.orm.find();
    }
    const response: UIResponseBase<Permission> = {
      isError: false,
      data: result,
      totalCount: result.length,
      messageKey: 'SUCCESS',
      statusCode: 200,
    };
    return response;
  }

  async SaveRolePermissions(roleIdAndPermissions: RoleIdAndPermissions) {
    try {
      await getManager().transaction(async transactionalEntityManager => {
        await transactionalEntityManager.delete(RoleAndPermission, {
          roleId: roleIdAndPermissions.roleId,
        });
        await transactionalEntityManager.insert(
          RoleAndPermission,
          roleIdAndPermissions.rolePermissions.map(
            mp =>
              <RoleAndPermission>{
                roleId: roleIdAndPermissions.roleId,
                permissionId: mp,
              },
          ),
        );
      });
      return <UIResponseBase<Permission>>{
        isError: false,
        messageKey: 'SUCCESS',
        statusCode: 200,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async Insert(role: Role) {
    try {
      const response: UIResponseBase<Role> = {
        isError: false,
        result: role,
        messageKey: 'SUCCESS',
        statusCode: 200,
      };
      await this.roleRepository.orm.insert(role);
      return response;
    } catch (error) {
      throw new Error(error);
    }
  }

  async Update(updateDetails: Role) {
    try {
      const role = await this.roleRepository.orm.findOne({
        where: {id: updateDetails.id},
      });
      const {id: _, ...updatedRole} = {...role, ...updateDetails};
      await this.roleRepository.orm.update({id: role.id}, updatedRole);
      return <UIResponseBase<Role>>{
        isError: false,
        result: updatedRole,
        messageKey: 'SUCCESS',
        statusCode: 200,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async Delete(Id: number) {
    try {
      await this.roleRepository.orm.delete({id: Id});
      return <UIResponseBase<Role>>{
        isError: false,
        messageKey: 'SUCCESS',
        statusCode: 200,
      };
    } catch (error) {
      throw new Error(error);
    }
  }
}
