import { Controller } from '@nestjs/common';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';
import { postContract } from 'src/api-contract';
import { BookingsService } from './bookings.service';

// @Controller()
// export class BookingsController {}
@Controller()
export class BookingsController {
  constructor(private readonly postService: BookingsService) {}

  //   @TsRestHandler(postContract)

  //   async handler() {

  //     return tsRestHandler(postContract, {

  //       getPost: async ({ params }) => {
  //         const post = await this.postService.getPost(params.id);
  //         if (!post) {
  //           return { status: 404, body: { message: 'Post not found' } };
  //         }
  //         return { status: 200, body: post };
  //       },
  //     });
  //   }
}
