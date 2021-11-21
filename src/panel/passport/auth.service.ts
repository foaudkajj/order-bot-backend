import {Injectable} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {User} from 'src/DB/models/User';
import {getRepository, Repository} from 'typeorm';
import {LoginRequest} from '../dtos/loginRequestDto';
import {LoginResponse} from '../dtos/loginResponse';
import {UIResponseBase} from '../dtos/UIResponseBase';
import * as bcrypt from 'bcrypt';
import {Menu} from 'src/DB/models/Menu';
import {sortBy} from 'underscore';
import {NavigationItems} from '../dtos/navigationItems';

@Injectable()
export class AuthService {
  userRepository: Repository<User> = getRepository(User);
  menusRepository: Repository<Menu> = getRepository(Menu);
  constructor(private readonly jwtService: JwtService) {}

  async validateUser(loginRequest: LoginRequest): Promise<any> {
    // let user: User = await this.userRepository.createQueryBuilder('user').innerJoinAndSelect('user.Role', 'Role').innerJoinAndSelect('Role.RoleAndPermessions', 'RoleAndPermessions').getOne();
    let user = await this.userRepository.findOne({
      where: {UserName: loginRequest.UserName},
      relations: [
        'Role',
        'Merchant',
        'Role.RoleAndPermessions',
        'Role.RoleAndPermessions.Permession',
        'Role.RoleAndPermessions.Permession.Menu',
      ],
    });
    if (!user) {
      // TODO: return error
      return;
    }
    let Menus = user.Role.RoleAndPermessions.filter(
      fi => fi.Permession.Menu,
    ).map(fi => fi.Permession.Menu);
    let parentMenus = await this.menusRepository.find({
      where: {IsParent: true},
    });
    Menus = Menus.concat(parentMenus);
    let sortedMenus = sortBy(Menus, 'Priority');
    let NavigationItems = this.CreateMenus(sortedMenus);
    NavigationItems = NavigationItems.filter(fi => fi.children.length != 0);

    const permessions = user.Role.RoleAndPermessions.map(
      mp => mp.Permession.PermessionKey,
    );

    const isMatch = await bcrypt.compareSync(
      loginRequest.Password,
      user?.Password,
    );
    if (user && isMatch) {
      let loginReponse: UIResponseBase<LoginResponse> = {
        Result: {
          IsAuthenticated: true,
          Token: this.jwtService.sign({
            UserName: user.UserName,
            Permessions: permessions,
            MerchantId: user.MerchantId,
          }),
          UserId: user.Id,
          MerchantId: user.MerchantId,
          UserName: user.UserName,
          UserStatus: user.UserStatus,
          Permessions: JSON.stringify(permessions),
          NavigationItems: NavigationItems,
        },
        StatusCode: 200,
        IsError: false,
        MessageKey: 'SUCCESS',
      };

      return loginReponse;
    }
    return null;
  }

  private CreateMenus(Menus: Menu[]) {
    let ParentMenus = Menus.filter(wh => wh.ParentId == null);
    let NavigationItems: NavigationItems[] = [];
    ParentMenus.map(fe => {
      NavigationItems.push(this.UserPermissionsCreator(fe, Menus));
    });

    return NavigationItems;
  }

  private UserPermissionsCreator(
    ParentMenue: Menu,
    UserPermessions: Menu[],
  ): NavigationItems {
    let navigationItems: NavigationItems = {
      icon: ParentMenue.Icon,
      key: ParentMenue.MenuKey,
      title: ParentMenue.Title,
      translate: ParentMenue.Translate,
      url: ParentMenue.URL,
      type: 'collapsable',
      children: [],
    };
    var parentChildren = UserPermessions.filter(
      wh => wh.ParentId == ParentMenue.MenuKey,
    );
    parentChildren.forEach(child => {
      if (child.IsParent) {
        navigationItems.children.push(
          this.UserPermissionsCreator(child, UserPermessions),
        );
      } else {
        navigationItems.children.push(<NavigationItems>{
          icon: child.Icon,
          key: child.MenuKey,
          title: child.Title,
          translate: child.Translate,
          type: 'item',
          url: child.URL,
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
