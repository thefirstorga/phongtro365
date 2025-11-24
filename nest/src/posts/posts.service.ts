import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePlaceDto } from './dto';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async getPosts() {
    try {
      // 1. Lấy danh sách places
      const places = await this.prisma.place.findMany({
        where: {
          status: 'SEE',
          owner: {
            status: 'ACTIVE',
          },
        },
        include: {
          photos: true,
          perks: true,
        },
      });

      // 2. Lấy min/max price
      const priceStats = await this.prisma.place.aggregate({
        where: {
          status: 'SEE',
          owner: {
            status: 'ACTIVE',
          },
        },
        _min: {
          price: true,
        },
        _max: {
          price: true,
        },
      });

      return {
        places,
        minPrice: priceStats._min.price ?? 0,
        maxPrice: priceStats._max.price ?? 0,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Đã xảy ra lỗi trong quá trình lấy dữ liệu',
      );
    }
  }

  async getPlaces(userId: number) {
    try {
      const places = await this.prisma.place.findMany({
        where: {
          ownerId: userId,
        },
        include: {
          photos: true,
          bookings: true,
        },
      });
      return places;
    } catch (error) {
      throw new InternalServerErrorException(
        'Lỗi khi lấy danh sách places của user',
      );
    }
  }

  async postPlace(userId: number, dto: CreatePlaceDto) {
    const {
      title,
      address,
      latitude,
      longitude,
      description,
      extraInfo,
      area,
      duration,
      price,
      addedPhotos,
      perks,
    } = dto;

    return this.prisma.place.create({
      data: {
        owner: {
          connect: { id: userId },
        },
        title,
        address,
        latitude,
        longitude,
        description,
        extraInfo,
        area: Number(area),
        duration: duration,
        price: Number(price),

        photos: {
          create: addedPhotos.map((url) => ({ url })),
        },

        perks: {
          create: perks.map((perk) => ({ perk })),
        },
      },
      include: {
        photos: true,
        perks: true,
      },
    });
  }

  async getPlaceById(id: number, userId: number) {
    const place = await this.prisma.place.findUnique({
      where: { id: id },
      include: {
        photos: true,
        perks: true,
        owner: {
          // Lấy thông tin chủ trọ
          select: {
            id: true,
            name: true,
            avatar: true,
            phone: true,
            zalo: true,
            violationCount: true,
            createAt: true,
            status: true,
          },
        },
        bookings: {
          // Lấy các booking liên quan
          include: {
            invoices: {
              // Lấy invoices liên quan tới booking
              include: {
                photos: true, // Lấy ảnh của Invoice
              },
            },
            comments: true,
          },
        },
        reports: {
          // Bao gồm thông tin đầy đủ của người báo cáo
          include: {
            reporter: {
              // Lấy thông tin người báo cáo
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                phone: true,
                zalo: true,
              },
            },
          },
        },
      },
    });

    return { place };
  }

  async getPlaceDetailById(id: number) {
    const place = await this.prisma.place.findUnique({
      where: { id: id },
      include: {
        photos: true,
        perks: true,
        bookings: {
          include: {
            comments: true,
            invoices: true,
            renter: {
              select: {
                id: true,
                name: true,
                avatar: true,
                phone: true,
                zalo: true,
              },
            },
          },
        },
        reports: {
          include: {
            reporter: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                phone: true,
                zalo: true,
              },
            },
          },
        },
      },
    });
    return { place };
  }

  async updatePlace(id: number, dto: CreatePlaceDto) {
    const {
      title,
      address,
      latitude,
      longitude,
      description,
      extraInfo,
      area,
      duration,
      price,
      addedPhotos,
      perks,
    } = dto;

    await this.prisma.placePhoto.deleteMany({
      where: { placeId: id },
    });
    await this.prisma.placePerk.deleteMany({
      where: { placeId: id },
    });

    const updatedPlace = await this.prisma.place.update({
      where: { id: id },
      data: {
        title,
        address,
        latitude,
        longitude,
        description,
        extraInfo,
        area: area,
        price: price,
        duration: duration,
        photos: {
          create: addedPhotos.map((url) => ({ url })),
        },

        perks: {
          create: perks.map((perk) => ({ perk })),
        },
      },
    });

    return updatedPlace;
  }
}
