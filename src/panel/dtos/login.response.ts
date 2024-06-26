import {UserStatus} from 'src/models';
import {NavigationItem} from './navigation-items';

export interface LoginResponse {
  userId: number;
  isAdmin: boolean;
  merchantId: number;
  userName: string;
  userStatus: UserStatus;
  token: string;
  isAuthenticated: boolean;
  permissions?: string[];
  navigationItems?: NavigationItem[];
}
