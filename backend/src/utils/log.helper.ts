import logger from './logger';
import { saveLogToDB } from './dbLogger';

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
  await saveLogToDB('info', message, error, responseTime);
}

export async function logWarn(
  message: string,
  error: unknown = null,
  responseTime?: number
) {
  if (error) logger.warn({ error: formatError(error) }, message);
  else logger.warn(message);
  await saveLogToDB('warn', message, error, responseTime);
}

export async function logError(
  message: string,
  error: unknown = null,
  responseTime?: number
) {
  if (error) logger.error({ error: formatError(error) }, message);
  else logger.error(message);
  await saveLogToDB('error', message, error, responseTime);
}
