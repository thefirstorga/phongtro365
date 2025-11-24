import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtCookieStrategy extends PassportStrategy(
  Strategy,
  'jwt-cookie',
) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          // console.log('Request Cookies:', req.cookies.token); // Kiểm tra cookies trong request
          return req?.cookies?.token;
        },
      ]),
      secretOrKey: config.get<string>('JWT_SECRET')!,
      ignoreExpiration: true,
    });
  }

  async validate(payload: any) {
    // console.log('JWT Cookie Payload:', payload);
    // payload là userData đã verify → return vào req.user
    return {
      id: payload.sub,
      email: payload.email,
    };
  }
}
