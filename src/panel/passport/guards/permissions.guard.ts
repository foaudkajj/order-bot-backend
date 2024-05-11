import {Injectable, CanActivate, ExecutionContext} from '@nestjs/common';
import {Reflector} from '@nestjs/core';
import {PERMISSIONS_KEY} from '../../decorators/permissions.decorator';
import {PermissionEnum} from '../../enums/permissions-enum';
@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<
      PermissionEnum[]
    >(PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);
    if (!requiredPermissions) {
      return true;
    }
    const {user} = context.switchToHttp().getRequest();
    return (
      user.isAdmin ??
      requiredPermissions.some(permission =>
        user?.permissions.includes(permission),
      )
    );
  }
}
