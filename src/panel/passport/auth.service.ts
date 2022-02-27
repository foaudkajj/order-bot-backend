import {Injectable} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {User} from 'src/db/models/user';
import {Repository} from 'typeorm';
import {LoginRequest} from '../dtos/login-request-dto';
import {LoginResponse} from '../dtos/login-response';
import {UIResponseBase} from '../dtos/ui-response-base';
import * as bcrypt from 'bcrypt';
import {Menu} from 'src/db/models/menu';
import {sortBy} from 'underscore';
import {NavigationItems} from '../dtos/navigation-items';
import {InjectRepository} from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Menu)
    private menusRepository: Repository<Menu>,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(loginRequest: LoginRequest): Promise<any> {
    // let user: User = await this.userRepository.createQueryBuilder('user').innerJoinAndSelect('user.Role', 'Role').innerJoinAndSelect('Role.RoleAndPermessions', 'RoleAndPermessions').getOne();
    const user = await this.userRepository.findOne({
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
    const parentMenus = await this.menusRepository.find({
      where: {IsParent: true},
    });
    Menus = Menus.concat(parentMenus);
    const sortedMenus = sortBy(Menus, 'Priority');
    const NavigationItems = this.CreateMenus(sortedMenus);

    const permessions = user.Role.RoleAndPermessions.map(
      mp => mp.Permession.PermessionKey,
    );

    const isMatch = await bcrypt.compareSync(
      loginRequest.Password,
      user?.Password,
    );
    if (user && isMatch) {
      const loginReponse: UIResponseBase<LoginResponse> = {
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
    const ParentMenus = Menus.filter(wh => wh.ParentId == null);
    const NavigationItems: NavigationItems[] = [];
    ParentMenus.forEach(fe => {
      NavigationItems.push(this.UserPermissionsCreator(fe, Menus));
    });

    return NavigationItems;
  }

  private UserPermissionsCreator(
    ParentMenue: Menu,
    UserPermessions: Menu[],
  ): NavigationItems {
    const parentChildren = UserPermessions.filter(
      wh => wh.ParentId === ParentMenue.MenuKey,
    );
    const navigationItems: NavigationItems = {
      icon: ParentMenue.Icon,
      key: ParentMenue.MenuKey,
      title: ParentMenue.Title,
      translate: ParentMenue.Translate,
      url: ParentMenue.URL,
      type: parentChildren.length > 0 ? 'collapsable' : 'item',
      children: [],
    };
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
