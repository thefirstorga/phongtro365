// post.contract.ts

import { initContract } from '@ts-rest/core';
import { z } from 'zod';

// Định nghĩa schema cho một bài đăng
export const PostSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  content: z.string(),
  authorId: z.string(),
  createdAt: z.date(),
});

// Định nghĩa kiểu dữ liệu từ schema để dùng trong code
export type Post = z.infer<typeof PostSchema>;

const c = initContract();

export const postContract = c.router(
  {
    /**
     * @route GET /posts/:id
     * Tên route: getPost
     */
    getPost: {
      method: 'GET',
      path: '/posts/:id', // Đường dẫn của route
      summary: 'Lấy thông tin một bài đăng bằng ID',

      // Định nghĩa tham số URL (params)
      pathParams: z.object({
        id: z.string().uuid().describe('ID duy nhất của bài đăng'),
      }),

      // Định nghĩa response (các status code và body tương ứng)
      responses: {
        // Response thành công (status 200)
        200: PostSchema, // Trả về đối tượng Post

        // Response lỗi (status 404)
        404: z.object({
          message: z.string().describe('Thông báo lỗi khi không tìm thấy'),
        }),
      },
    },
  },
  {
    // Cấu hình chung cho router này
    pathPrefix: '/posts', // Tất cả các route trong router này sẽ có tiền tố là /posts
  },
);
