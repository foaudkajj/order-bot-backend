import {Module} from '@nestjs/common';
import {JwtModule} from '@nestjs/jwt';
import {PassportModule} from '@nestjs/passport';
import {SharedModule} from 'src/shared.module';
import {AuthService} from './auth.service';
import {jwtConstants} from './constants';
import {JwtStrategy} from './strategies/jwt.strategy';
import {LocalStrategy} from './strategies/local.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: {expiresIn: '10h'},
    }),
    SharedModule,
  ],
  providers: [LocalStrategy, JwtStrategy, AuthService],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
