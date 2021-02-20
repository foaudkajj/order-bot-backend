import { UserStatus } from "src/DB/enums/UserStatus";
import { NavigationItems } from "./navigationItems";

export interface LoginResponse {
    UserId: number;
    UserName: string;
    UserStatus: UserStatus;
    Token: string;
    IsAuthenticated: boolean;
    Permessions?: string[];
    NavigationItems?: NavigationItems[];
}