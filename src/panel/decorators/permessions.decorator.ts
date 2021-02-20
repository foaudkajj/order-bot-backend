import { SetMetadata } from '@nestjs/common';
import { Permession } from '../enums/Permession';

export const PERMESSIONS_KEY = 'permessions';
export const Permessions = (...permessions: Permession[]) => SetMetadata(PERMESSIONS_KEY, permessions);