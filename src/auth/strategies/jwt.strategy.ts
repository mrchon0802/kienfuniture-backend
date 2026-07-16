import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { UserService } from '../../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
  private configService: ConfigService,
  private userService: UserService,
) {
  const secret = configService.get<string>('JWT_SECRET');
  if (!secret) throw new Error('JWT_SECRET is not defined');
  
  super({
    jwtFromRequest: ExtractJwt.fromExtractors([
      (req: Request) => req?.cookies?.access_token,
    ]),
    ignoreExpiration: false,
    secretOrKey: secret,
  });
}

  async validate(payload: any) {
    const user = await this.userService.findById(payload.id);
    if (!user) throw new UnauthorizedException('User không tồn tại');
    const { password, ...result } = user.toObject();
    return result;
  }
}
