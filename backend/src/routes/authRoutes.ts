// import { Hono } from 'hono';
// import { clerkAuthMiddleware } from '../middlewares/clerkAuth';
// import type { ClerkAuthPayload } from '../types/clerk';

// const protectedRoutes = new Hono<{ Variables: { auth: ClerkAuthPayload } }>();

// protectedRoutes.use('/protected', clerkAuthMiddleware);

// protectedRoutes.get('/protected', c => {
//   const auth = c.get('auth'); // ✅ Tidak error lagi
//   const emailParam = c.req.query('email');
//   return c.json({
//     message: 'Akses sukses',
//     user: auth,
//     queryEmail: emailParam,
//   });
// });

// export default protectedRoutes;

// routes/protectedRoutes.ts
import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { z } from 'zod';
import { clerkAuthMiddleware } from '../middlewares/clerkAuth';
import type { ClerkAuthPayload } from '../types/clerk';
declare module 'hono' {
  interface ContextVariableMap {
    auth: ClerkAuthPayload;
  }
}
export const protectedRoutes = (app: OpenAPIHono) => {
  app.use('*', clerkAuthMiddleware);

  app.openapi(
    createRoute({
      method: 'get',
      path: '/protected',
      summary: 'Access protected route',
      description: 'Route ini hanya bisa diakses user yang terautentikasi',
      tags: ['Protected'],

      request: {
        query: z.object({
          email: z.string().optional().openapi({
            example: 'user@email.com',
            description: 'Email optional dari query param',
          }),
        }),
      },
      responses: {
        200: {
          description: 'Akses sukses',
          content: {
            'application/json': {
              schema: z.object({
                message: z.string(),
                user: z.custom<ClerkAuthPayload>(),
                queryEmail: z.string().nullable(),
              }),
            },
          },
        },
        401: {
          description: 'Unauthorized',
        },
      },
    }),
    c => {
      const auth = c.get('auth') as ClerkAuthPayload;
      const emailParam = c.req.query('email');

      return c.json({
        message: 'Akses sukses',
        user: auth,
        queryEmail: emailParam ?? null,
      });
    }
  );
};
