import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { z } from 'zod';
import { verifyToken } from '@clerk/backend';
import {
  buildClerkVerifyOptions,
  extractBearerToken,
  extractEmailFromClerkPayload,
} from '../middlewares/clerkAuth';
import User from '../models/userModel';
import { ok, unauthorized } from '../utils/response.helper';
import type { ClerkAuthPayload } from '../types/clerk';

const responseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z
    .object({
      id: z.string().uuid(),
      name: z.string().nullable(),
      email: z.string().email(),
    })
    .nullable(),
});

export const clerkAuthRoutes = (app: OpenAPIHono) => {
  app.openapi(
    createRoute({
      method: 'get',
      path: '/auth/login',
      summary: 'Get user profile from Clerk token',
      description:
        'Mengambil profile user dari token Clerk, lalu validasi ke tabel users.',
      tags: ['Auth'],
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Berhasil diauntentikasi',
          content: {
            'application/json': {
              schema: responseSchema,
            },
          },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    async c => {
      const token = extractBearerToken(c.req.header('Authorization'));
      if (!token) {
        return unauthorized(c, 'No token provided');
      }

      try {
        const payload = (await verifyToken(
          token,
          buildClerkVerifyOptions()
        )) as ClerkAuthPayload;

        const email = extractEmailFromClerkPayload(payload);
        if (!email) {
          return unauthorized(c, 'Email not found in token');
        }

        const user = await User.findOne({ where: { email } });
        if (!user) {
          return unauthorized(c, 'User tidak terdaftar di sistem');
        }

        return ok(
          c,
          {
            id: user.id,
            name: user.name,
            email: user.email,
          },
          'Clerk Auth Login berhasil'
        );
      } catch (err: unknown) {
        return unauthorized(c, 'Token tidak valid', {
          message: err instanceof Error ? err.message : 'Unknown error',
        });
      }
    }
  );
};
