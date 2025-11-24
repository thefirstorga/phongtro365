import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtCookieGuard, JwtGuard } from 'src/auth/guard';

@Controller('users')
export class UserController {
  constructor(private readonly authService: UserService) {}
  @Get('profile')
  @UseGuards(JwtCookieGuard)
  async getProfile(@Req() req) {
    // console.log('Cookies:', req.cookies);
    const userId = req.user.id;

    return this.authService.getProfile(userId);
  }
}
