// utils/logWithDB.ts
import logger from '../utils/logger';
import { saveLogToDB } from '../utils/dbLogger';

export const logWithDB = async (
  level: 'info' | 'warn' | 'error',
  message: string,
  error?: unknown
) => {
  // jika error adalah instance Error, ambil message dan stack
  const errorData =
    error instanceof Error
      ? { name: error.name, message: error.message, stack: error.stack }
      : error !== undefined
        ? { value: error }
        : undefined;

  logger[level](errorData, message);

  await saveLogToDB(level, message, errorData);
};
