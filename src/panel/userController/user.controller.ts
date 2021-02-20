import { Request, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Permessions } from '../decorators/permessions.decorator';
import { AllowAnonymous } from '../decorators/public.decorator';
import { Permession } from '../enums/Permession';
import { AuthService } from '../passport/auth.service';
import { LocalAuthGuard } from '../passport/guards/local-auth.guard';

@Controller('api/User')
export class UserController {
    constructor(private authService: AuthService) {

    }

    @Post('Login')
    @AllowAnonymous()
    @UseGuards(LocalAuthGuard)
    async login(@Request() req): Promise<any> {
        return this.authService.login(req.user);
    }

    @Get('Test')
    @Permessions(Permession.CAN_TEST)
    Test(@Request() req): string {
        return req.user;
    }
}