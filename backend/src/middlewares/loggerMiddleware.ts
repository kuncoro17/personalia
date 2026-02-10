import { MiddlewareHandler } from 'hono';
import logger from '../utils/logger';

export const requestLogger: MiddlewareHandler = async (c, next) => {
  logger.info(`[${c.req.method}] ${c.req.url}`);
  await next();
};
