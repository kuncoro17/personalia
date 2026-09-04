// repositories/userRepository.ts
import User from '../models/userModel';
import { logError } from '../utils/log.helper'; // asumsi kamu punya ini

const getErrorMessage = (err: unknown): string => {
  const baseMessage =
    err instanceof Error && err.message.trim() ? err.message : '';

  if (typeof err === 'string' && err.trim()) return err;

  if (err && typeof err === 'object') {
    const maybe = err as {
      message?: unknown;
      errors?: Array<{
        message?: unknown;
        path?: unknown;
        validatorKey?: unknown;
      }>;
      original?: { message?: unknown; detail?: unknown; code?: unknown };
      parent?: { message?: unknown; detail?: unknown; code?: unknown };
    };

    if (Array.isArray(maybe.errors) && maybe.errors.length > 0) {
      const details = maybe.errors
        .map(item => {
          const msg = typeof item.message === 'string' ? item.message : '';
          const path = typeof item.path === 'string' ? item.path : '';
          if (msg && path) return `${path}: ${msg}`;
          return msg || path;
        })
        .filter(Boolean);

      if (details.length > 0) return details.join('; ');
    }

    const candidates = [
      maybe.message,
      maybe.original?.message,
      maybe.original?.detail,
      maybe.original?.code,
      maybe.parent?.message,
      maybe.parent?.detail,
      maybe.parent?.code,
    ];

    for (const candidate of candidates) {
      if (typeof candidate === 'string' && candidate.trim()) return candidate;
    }
  }

  if (baseMessage) return baseMessage;
  return 'Unknown error';
};

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    try {
      return await User.findOne({
        where: { email },
        attributes: ['id', 'email', 'name'],
      });
    } catch (err) {
      logError(`Error findByEmail: ${String(err)}`);
      throw new Error(`Gagal mencari user: ${getErrorMessage(err)}`);
    }
  }

  async createUser(data: {
    id?: string;
    email: string;
    name?: string | null;
  }): Promise<User> {
    try {
      return await User.create(data);
    } catch (err) {
      logError(`Error createUser: ${String(err)}`);
      throw new Error(`Gagal membuat user: ${getErrorMessage(err)}`);
    }
  }
}

export const userRepository = new UserRepository();
