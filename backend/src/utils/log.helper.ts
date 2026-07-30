import logger from './logger';
import { saveLogToDB } from './dbLogger';

const DB_LOG_LEVELS = ['info', 'warn', 'error'] as const;
type DbLogLevel = (typeof DB_LOG_LEVELS)[number];

const configuredDbLogLevel = (): DbLogLevel | 'off' => {
  const value = (process.env.DB_LOG_LEVEL ?? 'error').trim().toLowerCase();
  if (value === 'off' || DB_LOG_LEVELS.includes(value as DbLogLevel)) {
    return value as DbLogLevel | 'off';
  }
  return 'error';
};

const shouldSaveToDatabase = (level: DbLogLevel): boolean => {
  const minimum = configuredDbLogLevel();
  if (minimum === 'off') return false;
  return DB_LOG_LEVELS.indexOf(level) >= DB_LOG_LEVELS.indexOf(minimum);
};

function formatError(error: unknown): string | null {
  if (!error) return null;
  if (error instanceof Error) return error.stack ?? error.message;
  return String(error);
}

export async function logInfo(
  message: string,
  error: unknown = null,
  responseTime?: number
) {
  if (error) logger.info({ error: formatError(error) }, message);
  else logger.info(message);
  if (shouldSaveToDatabase('info')) {
    await saveLogToDB('info', message, error, responseTime);
  }
}

export async function logWarn(
  message: string,
  error: unknown = null,
  responseTime?: number
) {
  if (error) logger.warn({ error: formatError(error) }, message);
  else logger.warn(message);
  if (shouldSaveToDatabase('warn')) {
    await saveLogToDB('warn', message, error, responseTime);
  }
}

export async function logError(
  message: string,
  error: unknown = null,
  responseTime?: number
) {
  if (error) logger.error({ error: formatError(error) }, message);
  else logger.error(message);
  if (shouldSaveToDatabase('error')) {
    await saveLogToDB('error', message, error, responseTime);
  }
}
