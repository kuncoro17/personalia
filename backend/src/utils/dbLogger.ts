import AppLog from '../models/AppLog';
import logger from './logger';

let isAppLogTableEnsured = false;
let ensureTablePromise: Promise<void> | null = null;

const isMissingAppLogsTableError = (error: unknown): boolean => {
  if (!error || typeof error !== 'object') return false;

  const asRecord = error as Record<string, unknown>;
  const message = String(asRecord.message ?? '').toLowerCase();
  const original = (asRecord.original ?? {}) as Record<string, unknown>;
  const originalCode = String(original.code ?? '');
  const originalMessage = String(original.message ?? '').toLowerCase();

  return (
    originalCode === '42P01' ||
    message.includes('relation "app_logs" does not exist') ||
    originalMessage.includes('relation "app_logs" does not exist')
  );
};

const ensureAppLogTable = async () => {
  if (isAppLogTableEnsured) return;
  if (!ensureTablePromise) {
    ensureTablePromise = AppLog.sync()
      .then(() => {
        isAppLogTableEnsured = true;
      })
      .finally(() => {
        ensureTablePromise = null;
      });
  }
  await ensureTablePromise;
};

export async function saveLogToDB(
  level: string,
  message: string,
  error: unknown = null,
  responseTime?: number
) {
  // Konversi error ke string jika bukan null
  const errorString =
    error instanceof Error
      ? (error.stack ?? error.message)
      : String(error ?? '');

  const payload = {
    level,
    message,
    error: errorString || null,
    response_time_ms: responseTime ?? null,
  };

  try {
    await AppLog.create(payload);
    isAppLogTableEnsured = true;
    return;
  } catch (err) {
    if (!isMissingAppLogsTableError(err)) {
      logger.warn({ err }, 'Failed to write app log to database');
      return;
    }
  }

  try {
    await ensureAppLogTable();
    await AppLog.create(payload);
  } catch (err) {
    logger.warn({ err }, 'Failed to create/write app_logs table');
  }
}
