import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { z } from 'zod';
import * as controller from '../controllers/authController';

const emailSchema = z.object({
  email: z.string().email(),
});

export const jwtAuthRoutes = (app: OpenAPIHono) => {
  app.openapi(
    createRoute({
      method: 'post',
      path: '/auth/register',
      summary: 'Register user (email only)',
      description: 'Membuat user baru berdasarkan email',
      tags: ['Auth'],
      request: {
        body: {
          content: {
            'application/json': {
              schema: emailSchema,
            },
          },
        },
      },
      responses: {
        201: { description: 'Created' },
        400: { description: 'Bad Request' },
      },
    }),
    controller.register
  );

  app.openapi(
    createRoute({
      method: 'post',
      path: '/auth/login-jwt',
      summary: 'Login and get internal JWT',
      description: 'Login berdasarkan email, mengembalikan internal JWT',
      tags: ['Auth'],
      request: {
        body: {
          content: {
            'application/json': {
              schema: emailSchema,
            },
          },
        },
      },
      responses: {
        200: {
          description: 'OK',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean(),
                message: z.string(),
                data: z.object({
                  token: z.string(),
                  user: z.object({
                    id: z.string(),
                    email: z.string().email(),
                  }),
                }),
              }),
            },
          },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    controller.login
  );
};
