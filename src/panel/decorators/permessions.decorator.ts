import { SetMetadata } from '@nestjs/common';
import { PermessionEnum } from '../enums/Permession';

export const PERMESSIONS_KEY = 'permessions';
export const PermessionsGuard = (...permessions: PermessionEnum[]) => SetMetadata(PERMESSIONS_KEY, permessions);