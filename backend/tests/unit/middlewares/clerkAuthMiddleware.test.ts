import { describe, expect, it } from '@jest/globals';
import { Hono } from 'hono';

import { clerkAuthMiddleware } from '../../../src/middlewares/clerkAuth';
import { ClerkAuthPayload } from '../../../src/types/clerk';

describe('clerkAuthMiddleware', () => {
  it('tidak memverifikasi ulang request yang sudah memiliki auth', async () => {
    const app = new Hono<{
      Variables: { auth: ClerkAuthPayload };
    }>();

    app.use('*', async (c, next) => {
      c.set('auth', { sub: 'user-test' } as ClerkAuthPayload);
      await next();
    });
    app.use('*', clerkAuthMiddleware);
    app.get('/protected', c => c.json({ sub: c.get('auth').sub }));

    const response = await app.request('/protected');

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ sub: 'user-test' });
  });
});
