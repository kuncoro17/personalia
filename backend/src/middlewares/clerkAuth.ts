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

const DEFAULT_AUTHORIZED_PARTIES = [
  'https://staging-new-sas.bpkpenaburjakarta.or.id',
  'https://staging-personalia.bpkpenaburjakarta.or.id',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3002',
  'http://127.0.0.1:3002',
  'http://192.168.103.33:5173/',
];

const getAuthorizedParties = (): string[] => {
  const configured = stripOptionalQuotes(process.env.CLERK_AUTHORIZED_PARTIES);

  if (!configured) return DEFAULT_AUTHORIZED_PARTIES;

  const parsedConfigured = configured
    .split(',')
    .map(value => value.trim())
    .filter(Boolean);

  return Array.from(
    new Set([...DEFAULT_AUTHORIZED_PARTIES, ...parsedConfigured])
  );
};

export const buildClerkVerifyOptions = (): VerifyTokenOptions => {
  const secretKey = stripOptionalQuotes(process.env.CLERK_SECRET_KEY);
  const jwtKey = normalizeMultilineEnv(process.env.CLERK_JWT_KEY);
  const authorizedParties = getAuthorizedParties();
  const verifyOptions: VerifyTokenOptions = {};

  if (secretKey) verifyOptions.secretKey = secretKey;
  if (jwtKey) verifyOptions.jwtKey = jwtKey;
  if (authorizedParties.length > 0) {
    verifyOptions.authorizedParties = authorizedParties;
  }

  return verifyOptions;
};

export const extractBearerToken = (authHeader?: string): string | null => {
  if (!authHeader) return null;
  const [scheme, token] = authHeader.trim().split(/\s+/);
  if (scheme?.toLowerCase() !== 'bearer' || !token) return null;
  return token;
};

const extractEmailFromUnknown = (value: unknown): string | null => {
  if (typeof value === 'string') {
    const email = value.trim();
    return email.includes('@') ? email : null;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const email = extractEmailFromUnknown(item);
      if (email) return email;
    }
    return null;
  }

  if (!value || typeof value !== 'object') return null;

  const record = value as Record<string, unknown>;
  const preferredKeys = [
    'email',
    'email_address',
    'emailAddress',
    'email_addresses',
    'emailAddresses',
    'primary_email_address',
    'primaryEmailAddress',
  ];

  for (const key of preferredKeys) {
    const email = extractEmailFromUnknown(record[key]);
    if (email) return email;
  }

  return null;
};

export const extractEmailFromClerkPayload = (
  payload: ClerkAuthPayload
): string | null => {
  return extractEmailFromUnknown(payload);
};

export const clerkAuthMiddleware: MiddlewareHandler<{
  Variables: { auth: ClerkAuthPayload };
}> = async (c, next) => {
  const requestPath = c.req.path;

  // Public static files should stay accessible without auth token.
  if (requestPath.startsWith('/uploads/')) {
    return next();
  }

  const token = extractBearerToken(c.req.header('Authorization'));
  if (!token) {
    return c.json({ message: 'Missing Authorization header' }, 401);
  }

  // 🔹 1. Clerk verification
  try {
    const verifyOptions = buildClerkVerifyOptions();
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
  id: string;
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
    const verifyOptions = buildClerkVerifyOptions();
    const payload = await verifyToken(token, verifyOptions);
    const email = extractEmailFromClerkPayload(payload as ClerkAuthPayload);
    if (!email) {
      throw new HTTPException(401, { message: 'Email not found in token' });
    }

    const user = await User.findOne({ where: { email } });
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
