import {RoleAndPermession} from 'src/DB/models/RoleAndPermession';
import {User} from 'src/DB/models/User';

export class GetRolesDto {
  Id: number;
  RoleName: string;
  Description: string;
  RolePermessionsIds: string[];
}
