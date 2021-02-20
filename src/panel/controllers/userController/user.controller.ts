import { Request, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { LoginResponse } from 'src/panel/dtos/loginResponse';
import { AllowAnonymous } from '../../decorators/public.decorator';
import { AuthService } from '../../passport/auth.service';
import { LocalAuthGuard } from '../../passport/guards/local-auth.guard';

@Controller('api/User')
export class UserController {
    constructor(private authService: AuthService) {

    }

    @Post('Login')
    @AllowAnonymous()
    @UseGuards(LocalAuthGuard)
    async login(@Request() req): Promise<LoginResponse> {
        return this.authService.login(req.user);
    }
}