import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { z } from 'zod';
import * as controller from '../controllers/sasAuthController';
import { rateLimit } from '../middlewares/rateLimit';

const autoLoginRequestSchema = z.object({
  email: z.string().email(),
  timestamp: z.number().int(),
  nonce: z.string().min(12).max(128),
  signature: z.string().regex(/^[a-f0-9]{64}$/i),
});

const verifyRequestSchema = z.object({
  verify_token: z.string().min(32).max(256),
});

export const sasAuthRoutes = (app: OpenAPIHono) => {
  const autoLoginLimiter = rateLimit({
    keyPrefix: 'sas-auto-login',
    limit: Number(process.env.SAS_AUTO_LOGIN_RATE_LIMIT || 30),
    windowSeconds: 60,
  });
  const verifyLimiter = rateLimit({
    keyPrefix: 'sas-verify',
    limit: Number(process.env.SAS_VERIFY_RATE_LIMIT || 60),
    windowSeconds: 60,
  });

  app.use('/auth/sas/auto-login', autoLoginLimiter);
  app.use('/auth/sas/verify', verifyLimiter);

  app.openapi(
    createRoute({
      method: 'post',
      path: '/auth/sas/auto-login',
      summary: 'Create SAS auto-login verify token',
      description:
        'Validasi email, timestamp, nonce, dan HMAC signature dari SAS, lalu membuat verify token sekali pakai.',
      tags: ['Auth'],
      request: {
        body: {
          content: {
            'application/json': {
              schema: autoLoginRequestSchema,
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Verify token created',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean(),
                message: z.string(),
                data: z.object({
                  verify_token: z.string(),
                  expires_in: z.number(),
                  redirect_path: z.string(),
                }),
              }),
            },
          },
        },
        400: { description: 'Bad Request' },
        401: { description: 'Unauthorized' },
        404: { description: 'User belum terdaftar' },
        429: { description: 'Rate limit exceeded' },
      },
    }),
    controller.autoLogin
  );

  app.openapi(
    createRoute({
      method: 'post',
      path: '/auth/sas/verify',
      summary: 'Exchange SAS verify token for internal JWT',
      tags: ['Auth'],
      request: {
        body: {
          content: {
            'application/json': {
              schema: verifyRequestSchema,
            },
          },
        },
      },
      responses: {
        200: {
          description: 'SAS verification success',
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
        400: { description: 'Bad Request' },
        401: { description: 'Unauthorized' },
        429: { description: 'Rate limit exceeded' },
      },
    }),
    controller.verify
  );
};
