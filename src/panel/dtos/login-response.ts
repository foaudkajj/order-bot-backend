import {UserStatus} from 'src/db/models';
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
