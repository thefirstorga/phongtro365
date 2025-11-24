import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto, SignupDto } from './dto';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async signIn(@Body() dto: SigninDto, @Res() res: Response) {
    const result = await this.authService.signIn(dto);

    res.cookie('token', result.token, {
      httpOnly: true,
      secure: false, // đổi thành true nếu dùng HTTPS
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.json({
      message: result.message,
      user: result.user,
    });
  }

  @Post('register')
  async signUp(@Body() dto: SignupDto, @Res() res: Response) {
    const result = await this.authService.signUp(dto);

    res.cookie('token', result.token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    });

    return res.json({
      message: result.message,
      user: result.user,
    });
  }

  @Post('logout')
  async logout(@Res() res: Response) {
    res.clearCookie('token', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    });
    return res.json({ message: 'Logout successful' });
  }
}
