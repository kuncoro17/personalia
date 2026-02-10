// middlewares/sanitize.ts
import { Context, Next } from 'hono';
import xss from 'xss';

export const sanitizeInput = async (c: Context, next: Next) => {
  const contentType = c.req.header('content-type') || '';

  if (contentType.includes('application/json')) {
    const rawBody = (await c.req.json()) as Record<string, unknown>;
    const sanitizedBody: Record<string, unknown> = {};

    for (const key in rawBody) {
      const value = rawBody[key];
      sanitizedBody[key] = typeof value === 'string' ? xss(value) : value;
    }

    // simpan ke context
    c.set('sanitizedBody', sanitizedBody);
  }

  await next();
};
