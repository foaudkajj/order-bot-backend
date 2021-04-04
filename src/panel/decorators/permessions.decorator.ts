import { SetMetadata } from '@nestjs/common';
import { PermessionEnum } from '../enums/PermessionsEnum';

export const PERMESSIONS_KEY = 'permessions';
export const PermessionsGuard = (...permessions: PermessionEnum[]) => SetMetadata(PERMESSIONS_KEY, permessions);