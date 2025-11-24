import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto, SignupDto } from './dto';
import type { Response } from 'express';
import { GoogleOauthGuard } from './guard';

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

  @Get('google')
  @UseGuards(GoogleOauthGuard)
  async auth() {}

  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  async googleAuthCallback(@Req() req, @Res() res: Response) {
    const result = await this.authService.signInGoogleAuth(req.user);
    console.log('Google user info:', result);

    res.cookie('token', result.token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.redirect('http://localhost:5173');

    return res.json({
      message: result.message,
      user: result.user,
    });
  }
}
