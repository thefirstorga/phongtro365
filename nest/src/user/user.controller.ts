import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtCookieGuard, JwtGuard } from 'src/auth/guard';
import { UpdateProfileDto } from './dto';

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

  @Post('update-profile')
  @UseGuards(JwtCookieGuard)
  async updateProfile(@Req() req, @Body() updateProfile: UpdateProfileDto) {
    const userId = req.user.id;
    return this.authService.updateProfile(userId, updateProfile);
  }
}
