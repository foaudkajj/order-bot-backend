import { UserStatus } from 'src/db/models';
import { NavigationItem } from './navigation-items';

export interface LoginResponse {
  userId: number;
  merchantId: number;
  userName: string;
  userStatus: UserStatus;
  token: string;
  isAuthenticated: boolean;
  permissions?: string;
  navigationItems?: NavigationItem[];
}
