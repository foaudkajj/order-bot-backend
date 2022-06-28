import { SetMetadata } from '@nestjs/common';
import { PermissionEnum } from '../enums/permissions-enum';

export const PERMISSIONS_KEY = 'permissions';
export const PermissionsGuard = (...permissions: PermissionEnum[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
