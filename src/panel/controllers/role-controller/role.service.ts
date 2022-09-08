import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {PermissionRepository, RoleRepository} from 'src/db/repositories';
import {Permission} from 'src/models/permission';
import {Role} from 'src/models/role';
import {RoleAndPermission} from 'src/models/role-and-permission';
import {DataSourceLoadOptionsBase} from 'src/panel/dtos/devextreme-query';
import {GetRolesDto} from 'src/panel/dtos/get-roles.dto';
import {RoleIdAndPermissionsRequest} from 'src/panel/dtos/role-id-and-permissions.request';
import {UIResponseBase} from 'src/panel/dtos/ui-response-base';
import {DataSource} from 'typeorm';

@Injectable()
export class RoleService {
  constructor(
    private permissionRepository: PermissionRepository,
    private roleRepository: RoleRepository,
    private dataSource: DataSource,
  ) {}

  async GetRoles(query: DataSourceLoadOptionsBase) {
    let roles: Role[];
    if (query.take && query.skip) {
      roles = await this.roleRepository.orm.find({
        take: query.take,
        skip: query.skip,
        relations: {roleAndPermissions: {permission: true}},
      });
    } else {
      roles = await this.roleRepository.orm.find({
        relations: {roleAndPermissions: {permission: true}},
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
    const response: UIResponseBase<GetRolesDto[]> = {
      data: result,
      totalCount: result.length,
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
      data: result,
      totalCount: result.length,
    };
    return response;
  }

  async SaveRolePermissions(roleIdAndPermissions: RoleIdAndPermissionsRequest) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.delete(RoleAndPermission, {
        roleId: roleIdAndPermissions.roleId,
      });

      await queryRunner.manager.insert(
        RoleAndPermission,
        roleIdAndPermissions.rolePermissions.map(
          mp =>
            <RoleAndPermission>{
              roleId: roleIdAndPermissions.roleId,
              permissionId: mp,
            },
        ),
      );

      await queryRunner.commitTransaction();
    } catch (err) {
      // since we have errors lets rollback the changes we made
      await queryRunner.rollbackTransaction();

      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }
  }

  async Insert(role: Role) {
    try {
      const response: UIResponseBase<Role> = {
        data: role,
      };
      await this.roleRepository.orm.insert(role);
      return response;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
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
        data: updatedRole,
      };
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async Delete(Id: number) {
    try {
      await this.roleRepository.orm.delete({id: Id});
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
