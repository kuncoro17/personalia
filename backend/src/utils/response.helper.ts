import { Context } from 'hono';

export const ok = <T>(c: Context, data: T, message = 'OK') =>
  c.json({ success: true, message, data } as const, { status: 200 });

export const error = (
  c: Context,
  message = 'Something went wrong',
  status: 400 | 401 | 403 | 404 | 422 | 500 = 500
) => c.json({ success: false, message } as const, { status } as const);

export const notFound = <T>(c: Context, message = 'Not Found', error?: T) => {
  return c.json({ success: false, message, error } as const, { status: 404 });
};

export const created = <T>(c: Context, data: T, message = 'Created') =>
  c.json({ success: true, message, data } as const, { status: 201 });

export const badRequest = <T>(
  c: Context,
  message = 'Bad Request',
  error?: T
) => {
  return c.json({ success: false, message, error } as const, { status: 400 });
};

export const unauthorized = <T>(
  c: Context,
  message = 'Unauthorized',
  error?: T
) => {
  return c.json({ success: false, message, error } as const, { status: 401 });
};
