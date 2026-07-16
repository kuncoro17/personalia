import { Context, MiddlewareHandler } from 'hono';
import redis from '../libs/redis';

interface RateLimitOptions {
  keyPrefix: string;
  limit: number;
  windowSeconds: number;
}

const getClientKey = (c: Context) =>
  c.req.header('x-forwarded-for')?.split(',')[0]?.trim() ||
  c.req.header('x-real-ip') ||
  'unknown';

export const rateLimit = ({
  keyPrefix,
  limit,
  windowSeconds,
}: RateLimitOptions): MiddlewareHandler => {
  return async (c, next) => {
    const key = `rate:${keyPrefix}:${getClientKey(c)}`;
    const current = await redis.incr(key);

    if (current === 1) {
      await redis.expire(key, windowSeconds);
    }

    const ttl = await redis.ttl(key);
    c.header('X-RateLimit-Limit', String(limit));
    c.header('X-RateLimit-Remaining', String(Math.max(limit - current, 0)));
    c.header('X-RateLimit-Reset', String(Math.max(ttl, 0)));

    if (current > limit) {
      return c.json(
        {
          success: false,
          message: 'Terlalu banyak request. Coba lagi nanti.',
        },
        429
      );
    }

    await next();
  };
};
