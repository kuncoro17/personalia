import { MiddlewareHandler } from 'hono';
import { verifyToken, VerifyTokenOptions } from '@clerk/backend';
import dotenv from 'dotenv';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { ClerkAuthPayload } from '../types/clerk';
import { HTTPException } from 'hono/http-exception';
import logger from '../utils/logger';
import User from '../models/userModel';
dotenv.config();

const stripOptionalQuotes = (value?: string): string | undefined => {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (trimmed.length < 2) return trimmed;

  const isWrappedWithDoubleQuotes =
    trimmed.startsWith('"') && trimmed.endsWith('"');
  const isWrappedWithSingleQuotes =
    trimmed.startsWith("'") && trimmed.endsWith("'");

  return isWrappedWithDoubleQuotes || isWrappedWithSingleQuotes
    ? trimmed.slice(1, -1)
    : trimmed;
};

const normalizeMultilineEnv = (value?: string): string | undefined => {
  return stripOptionalQuotes(value)?.replace(/\\n/g, '\n');
};

const extractBearerToken = (authHeader?: string): string | null => {
  if (!authHeader) return null;
  const [scheme, token] = authHeader.trim().split(/\s+/);
  if (scheme?.toLowerCase() !== 'bearer' || !token) return null;
  return token;
};

export const clerkAuthMiddleware: MiddlewareHandler<{
  Variables: { auth: ClerkAuthPayload };
}> = async (c, next) => {
  const token = extractBearerToken(c.req.header('Authorization'));
  if (!token) {
    return c.json({ message: 'Missing Authorization header' }, 401);
  }

  // 🔹 1. Clerk verification
  try {
    const secretKey = stripOptionalQuotes(process.env.CLERK_SECRET_KEY);
    const jwtKey = normalizeMultilineEnv(process.env.CLERK_JWT_KEY);
    const verifyOptions: VerifyTokenOptions = {};

    if (secretKey) verifyOptions.secretKey = secretKey;
    if (jwtKey) verifyOptions.jwtKey = jwtKey;

    const payload = await verifyToken(token, verifyOptions);
    c.set('auth', payload as ClerkAuthPayload);
    return await next();
  } catch (_err: unknown) {
    logger.warn('Clerk verification failed', _err);
  }

  // 🔹 2. Fallback ke internal JWT
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload &
      ClerkAuthPayload;
    c.set('auth', decoded);
    return await next();
  } catch (_err: unknown) {
    logger.warn('Internal JWT verification failed', _err);
    return c.json({ message: 'Invalid token' }, 401);
  }
};

export interface AuthUser {
  id: number;
  email: string;
}

export const getCurrentUser: MiddlewareHandler<{
  Variables: { auth: AuthUser };
}> = async (c, next) => {
  logger.info('get_current_user called');

  const token = extractBearerToken(c.req.header('Authorization'));
  if (!token) {
    throw new HTTPException(401, {
      message: 'Authorization header missing or invalid',
    });
  }

  try {
    const secretKey = stripOptionalQuotes(process.env.CLERK_SECRET_KEY);
    const jwtKey = normalizeMultilineEnv(process.env.CLERK_JWT_KEY);
    const verifyOptions: VerifyTokenOptions = {
      ...(secretKey ? { secretKey } : {}),
      ...(jwtKey ? { jwtKey } : {}),
    };

    const payload = await verifyToken(token, verifyOptions);
    if (!payload.email) {
      throw new HTTPException(401, { message: 'Email not found in token' });
    }

    const user = await User.findOne({ where: { email: payload.email } });
    if (!user) {
      throw new HTTPException(401, { message: 'User not registered' });
    }

    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
    };

    c.set('auth', authUser);
    await next();
  } catch (_err: unknown) {
    logger.error({ err: _err }, 'Token verification failed');
    throw new HTTPException(401, {
      message: 'Invalid or expired token',
      cause: _err,
    });
  }
};
