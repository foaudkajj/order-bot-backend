import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMESSIONS_KEY } from '../decorators/permessions.decorator';
import { PermessionEnum } from '../enums/PermessionsEnum';
@Injectable()
export class PermessionsGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredPermessions = this.reflector.getAllAndOverride<PermessionEnum[]>(PERMESSIONS_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredPermessions) {
            return true;
        }
        const { user } = context.switchToHttp().getRequest();
        return requiredPermessions.some((permession) => user?.Permessions.includes(permession));
    }
}