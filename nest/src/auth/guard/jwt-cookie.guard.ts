import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtCookieGuard extends AuthGuard('jwt-cookie') {}
