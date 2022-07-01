import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/db/models/user';
import { Repository } from 'typeorm';
import { LoginRequest } from '../dtos/login-request-dto';
import { LoginResponse } from '../dtos/login-response';
import { UIResponseBase } from '../dtos/ui-response-base';
import * as bcrypt from 'bcrypt';
import { Menu } from 'src/db/models/menu';
import { NavigationItem } from '../dtos/navigation-items';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Menu)
    private menusRepository: Repository<Menu>,
    private readonly jwtService: JwtService,
  ) { }

  async validateUser(loginRequest: LoginRequest): Promise<any> {
    // let user: User = await this.userRepository.createQueryBuilder('user').innerJoinAndSelect('user.Role', 'Role').innerJoinAndSelect('role.roleAndPermissions', 'roleAndPermissions').getOne();
    const user = await this.userRepository.findOne({
      where: { userName: loginRequest.UserName },
      relations: [
        'role',
        'merchant',
        'role.roleAndPermissions',
        'role.roleAndPermissions.permission',
        'role.roleAndPermissions.permission.menu',
      ],
    });
    if (!user) {
      // TODO: return error
      return;
    }
    let menus = user.role.roleAndPermissions.filter(
      fi => fi.permission.menu,
    ).map(fi => fi.permission.menu);
    const parentMenus = await this.menusRepository.find({
      where: { isParent: true },
    });
    menus = menus.concat(parentMenus);
    const navigationItems = this.createMenus(menus);

    const permissions = user.role.roleAndPermissions.map(
      mp => mp.permission.permissionKey,
    );

    const isMatch = bcrypt.compareSync(
      loginRequest.Password,
      user?.password
    );
    if (user && isMatch) {
      const loginReponse: UIResponseBase<LoginResponse> = {
        result: {
          isAuthenticated: true,
          token: this.jwtService.sign({
            userName: user.userName,
            permissions: permissions,
            merchantId: user.merchantId,
          }),
          userId: user.id,
          merchantId: user.merchantId,
          userName: user.userName,
          userStatus: user.userStatus,
          permissions: JSON.stringify(permissions),
          navigationItems: navigationItems,
        },
        statusCode: 200,
        isError: false,
        messageKey: 'SUCCESS',
      };

      return loginReponse;
    }
    return null;
  }

  private createMenus(menus: Menu[]): NavigationItem[] {
    const parentMenus = menus.filter(wh => wh.parentId == null);
    const navigationItems: NavigationItem[] = [];
    parentMenus.forEach(fe => {
      navigationItems.push(this.userPermissionsCreator(fe, menus));
    });

    return navigationItems;
  }

  private userPermissionsCreator(
    parentMenu: Menu,
    userPermissions: Menu[],
  ): NavigationItem {
    const parentChildren = userPermissions.filter(
      wh => wh.parentId === parentMenu.menuKey,
    );
    const navigationItems: NavigationItem = {
      icon: parentMenu.icon,
      key: parentMenu.menuKey,
      title: parentMenu.title,
      translate: parentMenu.translate,
      url: parentMenu.url,
      priority: parentMenu.priority,
      type: parentChildren.length > 0 ? 'collapsable' : 'item',
      children: [],
    };
    parentChildren.forEach(child => {
      if (child.isParent) {
        navigationItems.children.push(
          this.userPermissionsCreator(child, userPermissions),
        );
      } else {
        navigationItems.children.push(<NavigationItem>{
          icon: child.icon,
          key: child.menuKey,
          title: child.title,
          translate: child.translate,
          priority: child.priority,
          type: 'item',
          url: child.url,
          children: [],
        });
      }
    });
    return navigationItems;
  }

  async login(response: LoginResponse) {
    return response;
  }
}
