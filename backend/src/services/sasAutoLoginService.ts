import crypto from 'crypto';
import jwt, { SignOptions } from 'jsonwebtoken';
import redis from '../libs/redis';
import User from '../models/userModel';
import logger from '../utils/logger';

export interface SasAutoLoginPayload {
  email: string;
  timestamp: number;
  nonce: string;
  signature: string;
}

interface SasVerifyRecord {
  email: string;
  user_id: string;
  created_at: number;
}

const DEFAULT_TTL_SECONDS = 300;
const DEFAULT_VERIFY_TTL_SECONDS = 300;
const DEFAULT_NONCE_TTL_SECONDS = 300;

const getPositiveNumberEnv = (key: string, fallback: number) => {
  const parsed = Number(process.env[key]);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const getRequiredEnv = (key: string) => {
  const value = process.env[key]?.trim();
  if (!value) throw new Error(`${key} belum dikonfigurasi`);
  return value;
};

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const hashEmail = (email: string) =>
  crypto.createHash('sha256').update(normalizeEmail(email)).digest('hex');

const buildCanonicalMessage = (
  email: string,
  timestamp: number,
  nonce: string
) => `${normalizeEmail(email)}.${timestamp}.${nonce}`;

const signMessage = (message: string, secret: string) =>
  crypto.createHmac('sha256', secret).update(message).digest('hex');

const timingSafeEqualString = (a: string, b: string) => {
  const left = Buffer.from(a, 'hex');
  const right = Buffer.from(b, 'hex');

  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
};

const logRejectedAutoLogin = (
  reason: string,
  email: string,
  details: Record<string, unknown> = {}
) => {
  logger.warn(
    {
      reason,
      email_hash: email ? hashEmail(email) : null,
      ...details,
    },
    'SAS auto-login rejected'
  );
};

export class SasAutoLoginService {
  async createVerifyToken(payload: SasAutoLoginPayload) {
    const email = normalizeEmail(payload.email);
    const secret = getRequiredEnv('SAS_AUTO_LOGIN_SECRET');
    const ttlSeconds = getPositiveNumberEnv(
      'SAS_AUTO_LOGIN_TTL_SECONDS',
      DEFAULT_TTL_SECONDS
    );
    const nonceTtlSeconds = getPositiveNumberEnv(
      'SAS_AUTO_LOGIN_NONCE_TTL_SECONDS',
      Math.max(ttlSeconds, DEFAULT_NONCE_TTL_SECONDS)
    );
    const verifyTtlSeconds = getPositiveNumberEnv(
      'SAS_VERIFY_TOKEN_TTL_SECONDS',
      DEFAULT_VERIFY_TTL_SECONDS
    );

    const nowSeconds = Math.floor(Date.now() / 1000);
    const ageSeconds = Math.abs(nowSeconds - payload.timestamp);

    if (!email) {
      logRejectedAutoLogin('missing_email', email);
      throw new Error('Email wajib diisi');
    }

    if (!payload.nonce || payload.nonce.length < 12) {
      logRejectedAutoLogin('invalid_nonce', email);
      throw new Error('Nonce tidak valid');
    }

    if (!Number.isInteger(payload.timestamp) || ageSeconds > ttlSeconds) {
      logRejectedAutoLogin('expired_timestamp', email, {
        timestamp: payload.timestamp,
        age_seconds: ageSeconds,
      });
      throw new Error('Request auto-login sudah expired');
    }

    const expectedSignature = signMessage(
      buildCanonicalMessage(email, payload.timestamp, payload.nonce),
      secret
    );

    if (!timingSafeEqualString(payload.signature, expectedSignature)) {
      logRejectedAutoLogin('invalid_signature', email);
      throw new Error('Signature tidak valid');
    }

    const nonceKey = `sas:auto-login:nonce:${payload.nonce}`;
    const nonceStored = await redis.set(
      nonceKey,
      '1',
      'EX',
      nonceTtlSeconds,
      'NX'
    );
    if (nonceStored !== 'OK') {
      logRejectedAutoLogin('nonce_replay', email);
      throw new Error('Nonce sudah pernah dipakai');
    }

    const user = await User.findOne({
      where: { email },
      attributes: ['id', 'email', 'name'],
    });

    if (!user) {
      logRejectedAutoLogin('user_not_registered', email);
      const error = new Error('User belum terdaftar');
      error.name = 'SAS_USER_NOT_REGISTERED';
      throw error;
    }

    const userId = user.get('id');
    if (typeof userId !== 'string' || !userId) {
      throw new Error('Data user tidak valid');
    }

    const verifyToken = crypto.randomBytes(32).toString('hex');
    const verifyRecord: SasVerifyRecord = {
      email,
      user_id: userId,
      created_at: nowSeconds,
    };

    await redis.set(
      `sas:auto-login:verify:${verifyToken}`,
      JSON.stringify(verifyRecord),
      'EX',
      verifyTtlSeconds
    );

    return {
      verify_token: verifyToken,
      expires_in: verifyTtlSeconds,
      redirect_path: `/sas/verify?token=${verifyToken}`,
    };
  }

  async verifyToken(verifyToken: string) {
    if (!verifyToken || verifyToken.length < 32) {
      throw new Error('Verify token tidak valid');
    }

    const key = `sas:auto-login:verify:${verifyToken}`;
    const stored = await redis.get(key);
    if (!stored) {
      throw new Error('Verify token expired atau tidak valid');
    }

    await redis.del(key);

    const record = JSON.parse(stored) as SasVerifyRecord;
    const jwtSecret = getRequiredEnv('JWT_SECRET');
    const expiresIn = (process.env.SAS_SESSION_JWT_EXPIRES_IN ||
      '1h') as SignOptions['expiresIn'];

    const token = jwt.sign(
      {
        id: record.user_id,
        email: record.email,
        auth_source: 'sas',
        sas_auto_login: true,
      },
      jwtSecret,
      {
        expiresIn,
      }
    );

    return {
      token,
      user: {
        id: record.user_id,
        email: record.email,
      },
    };
  }
}

export const sasAutoLoginService = new SasAutoLoginService();
