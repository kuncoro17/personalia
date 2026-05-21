import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { z } from 'zod';
import { clerkAuthMiddleware } from '../middlewares/clerkAuth';
import * as controller from '../controllers/userController';

const createUserRequestSchema = z.object({
  id: z.string().uuid().optional().openapi({
    example: '48d6b668-b8f3-425b-9ca1-f68d9d8e5513',
    description:
      'Optional. Isi jika kolom users.id di database tidak punya default/auto-generate.',
  }),
  email: z.string().email(),
  name: z.string().nullable().optional(),
});

const userResponseSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().nullable(),
  created_at: z.union([z.string(), z.date()]),
  updated_at: z.union([z.string(), z.date()]),
});

export const userRoutes = (app: OpenAPIHono) => {
  app.use('*', clerkAuthMiddleware);

  app.openapi(
    createRoute({
      method: 'post',
      path: '/personalia/users',
      summary: 'Create user',
      description: 'Membuat user baru',
      tags: ['Users'],
      security: [{ bearerAuth: [] }],
      request: {
        body: {
          content: {
            'application/json': {
              schema: createUserRequestSchema,
            },
          },
        },
      },
      responses: {
        201: {
          description: 'User created',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean(),
                message: z.string(),
                data: userResponseSchema,
              }),
            },
          },
        },
        400: { description: 'Bad Request' },
        401: { description: 'Unauthorized' },
      },
    }),
    controller.createUser
  );
};
