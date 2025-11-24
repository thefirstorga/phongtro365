import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateProfileDto } from './dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  async getProfile(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        phone: true,
        zalo: true,
        status: true,
        createAt: true,
        violationCount: true,
      },
    });

    return user; // Nest tự serialize JSON
  }

  updateProfile(userId: number, updateProfile: UpdateProfileDto) {
    const { name, phone, zalo } = updateProfile;
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        name,
        phone,
        zalo,
      },
    });
  }
}
