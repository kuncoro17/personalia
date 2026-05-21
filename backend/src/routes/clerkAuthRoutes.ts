import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { z } from 'zod';
import { verifyToken } from '@clerk/backend';
import jwt, { JwtPayload } from 'jsonwebtoken';
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
      summary: 'Get user profile from auth token',
      description:
        'Mengambil profile user dari token (Clerk atau internal JWT), lalu validasi ke tabel users.',
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

      let email: string | null = null;

      try {
        // 1) Prefer Clerk token verification (RS256, issuer/audience checks, etc.)
        const payload = (await verifyToken(
          token,
          buildClerkVerifyOptions()
        )) as ClerkAuthPayload;

        email = extractEmailFromClerkPayload(payload);
      } catch {
        // 2) Fallback to internal JWT (HS256) for /auth/login-jwt flow
        const secret = process.env.JWT_SECRET;
        if (!secret) {
          return unauthorized(c, 'Token tidak valid', {
            message: 'JWT_SECRET is not configured',
          });
        }

        try {
          const decoded = jwt.verify(token, secret) as JwtPayload & {
            email?: unknown;
          };
          email = typeof decoded.email === 'string' ? decoded.email.trim() : '';
          if (!email) email = null;
        } catch (err: unknown) {
          return unauthorized(c, 'Token tidak valid', {
            message: err instanceof Error ? err.message : 'Unknown error',
          });
        }
      }

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
        'Login berhasil'
      );
    }
  );
};
