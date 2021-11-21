import {UserStatus} from 'src/DB/models';
import {NavigationItems} from './navigation-items';

export interface LoginResponse {
  UserId: number;
  MerchantId: number;
  UserName: string;
  UserStatus: UserStatus;
  Token: string;
  IsAuthenticated: boolean;
  Permessions?: string;
  NavigationItems?: NavigationItems[];
}
