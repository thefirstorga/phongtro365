import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { PostsService } from './posts.service';
import { JwtCookieGuard } from 'src/auth/guard';
import { CreatePlaceDto } from './dto';

@Controller('post')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}
  @Post('/upload')
  @UseInterceptors(
    FilesInterceptor('photos', 100, {
      storage: diskStorage({
        destination: 'uploads',
        filename: (req, file, cb) => {
          const ext = path.extname(file.originalname);
          const uniqueName = `${Date.now()}-${Math.random()}${ext}`;
          cb(null, uniqueName);
        },
      }),
    }),
  )
  async uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
    // return files.map((file) => ({
    //   filename: file.filename,
    //   path: file.path.replace(/\\/g, '/'),
    // }));
    return files.map((file) =>
      file.path.replace('uploads', '').replace(/\\/g, '/'),
    );
  }

  @Get('/places')
  getPosts() {
    return this.postsService.getPosts();
  }

  @Get('/user-places')
  @UseGuards(JwtCookieGuard)
  getUserPlaces(@Req() req) {
    const userId = req.user.id;
    return this.postsService.getPlaces(userId);
  }

  @Post('/places')
  @UseGuards(JwtCookieGuard)
  createPlace(@Body() dto: CreatePlaceDto, @Req() req) {
    const userId = req.user.id;
    return this.postsService.postPlace(userId, dto);
  }

  @Get('/place/:id')
  @UseGuards(JwtCookieGuard)
  async getPlaceById(@Param('id') id: string, @Req() req) {
    const userId = req.user.id;
    return this.postsService.getPlaceById(+id, userId);
  }

  @Get('/placedetail/:id')
  @UseGuards(JwtCookieGuard)
  async getPlaceDetailById(@Param('id') id: string) {
    return this.postsService.getPlaceDetailById(+id);
  }

  @Put('/places/:id')
  @UseGuards(JwtCookieGuard)
  updatePlace(@Param('id') id: string, @Body() dto: CreatePlaceDto) {
    return this.postsService.updatePlace(+id, dto);
  }
}
