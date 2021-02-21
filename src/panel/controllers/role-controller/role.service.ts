import { Injectable } from '@nestjs/common';
import { Permession } from 'src/DB/models/Permession';
import { Role } from 'src/DB/models/Role';
import { RoleAndPermession } from 'src/DB/models/RoleAndPermession';
import { DataSourceLoadOptionsBase } from 'src/panel/dtos/DevextremeQuery';
import { GetRolesDto } from 'src/panel/dtos/GetRolesDto';
import { RoleIdAndPermessions } from 'src/panel/dtos/RoleIdAndPermessions';
import { UIResponseBase } from 'src/panel/dtos/UIResponseBase';
import { getManager, getRepository } from 'typeorm';

@Injectable()
export class RoleService {
    constructor() {

    }


    async GetRoles(query: DataSourceLoadOptionsBase) {
        let roles: Role[];
        if (query.take && query.skip) {
            roles = await getRepository(Role).find({ take: query.take, skip: query.skip, relations: ['RoleAndPermessions', 'RoleAndPermessions.Permession'] });
        } else {
            roles = await getRepository(Role).find({ relations: ['RoleAndPermessions', 'RoleAndPermessions.Permession'] });
        }
        let result = roles.map(mp => <GetRolesDto>{
            Id: mp.Id,
            Description: mp.Description,
            RoleName: mp.RoleName,
            RolePermessionsIds: mp.RoleAndPermessions.map(mpp => mpp.Permession.PermessionKey)
        });
        let response: UIResponseBase<GetRolesDto> = { IsError: false, data: result, totalCount: result.length, MessageKey: 'SUCCESS', StatusCode: 200 };
        return response;
    }


    async GetPermessions(query: DataSourceLoadOptionsBase) {
        let result;
        if (query.take && query.skip) {
            result = await getRepository(Permession).find({ take: query.take, skip: query.skip });
        } else {
            result = await getRepository(Permession).find();
        }
        let response: UIResponseBase<Permession> = { IsError: false, data: result, totalCount: result.length, MessageKey: 'SUCCESS', StatusCode: 200 };
        return response;
    }

    async SaveRolePermessions(roleIdAndPermessions: RoleIdAndPermessions) {
        try {
            await getManager().transaction(async transactionalEntityManager => {
                await transactionalEntityManager.delete(RoleAndPermession, { RoleId: roleIdAndPermessions.roleId });
                await transactionalEntityManager.insert(RoleAndPermession, roleIdAndPermessions.rolePermessions.map(mp => <RoleAndPermession>{
                    RoleId: roleIdAndPermessions.roleId,
                    PermessionId: mp
                }));
            });
            return <UIResponseBase<Permession>>{ IsError: false, MessageKey: 'SUCCESS', StatusCode: 200 }
        } catch (error) {
            console.log(error)
            return <UIResponseBase<Permession>>{ IsError: true, MessageKey: 'ERROR', StatusCode: 500 }
        }
    }
}