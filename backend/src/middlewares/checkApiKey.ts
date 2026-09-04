import { Context, Next } from 'hono';
import {
  BadRequestException,
  UnauthorizedException,
} from '../utils/http-exception';

export const apiKeyMiddleware = async (c: Context, next: Next) => {
  // Ambil header x-api-key
  const apiKey = c.req.header('x-api-key');

  if (!apiKey) {
    throw new BadRequestException('API Key is required in header x-api-key');
  }

  if (apiKey !== process.env.PERSONALIA_API_KEY) {
    throw new UnauthorizedException('Invalid API Key');
  }

  await next();
};
