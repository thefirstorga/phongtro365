import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SigninDto, SignupDto } from './dto';
import * as argon from 'argon2';
import { Prisma } from 'generated/prisma';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async signUp(dto: SignupDto) {
    const hash = await argon.hash(dto.password);
    try {
      const user = await this.prisma.user.create({
        data: {
          name: dto.name,
          email: dto.email,
          password: hash,
        },
      });
      // return this.signToken(user.id, user.email);
      const token = await this.signToken(user.id, user.email);

      return {
        message: 'Registration successful!',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        token,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Email already exists');
        }
      }
      throw error;
    }
  }

  async signIn(dto: SigninDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) {
      throw new ForbiddenException('Email không tồn tại.');
    }
    if (user.status === 'BLACKLISTED') {
      throw new ForbiddenException('Tài khoản đã bị khóa vĩnh viễn.');
    }

    const pwMatches = await argon.verify(user.password, dto.password);
    if (!pwMatches) {
      throw new ForbiddenException('Mật khẩu không đúng.');
    }

    const token = await this.signToken(user.id, user.email);

    return {
      message: 'Đăng nhập thành công.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        status: user.status,
      },
      token,
    };
  }

  async signToken(userId: number, email: string): Promise<string> {
    const payload = {
      sub: userId,
      email,
    };

    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
      secret: secret,
    });

    return token;
  }
}
