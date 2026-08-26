import AppLog from '../models/AppLog';
import logger from './logger';

export interface AuditLogPayload {
  action: 'READ' | 'CREATE' | 'UPDATE';
  method: string;
  path: string;
  statusCode: number;
  responseTime: number;
  actorId: string;
  actorEmail?: string | null;
  actorName?: string | null;
  authSource?: string | null;
}

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

export async function saveAuditLogToDB(payload: AuditLogPayload) {
  try {
    await AppLog.create({
      level: 'info',
      message: `${payload.action} ${payload.method} ${payload.path}`,
      error: null,
      response_time_ms: payload.responseTime,
      action: payload.action,
      http_method: payload.method,
      path: payload.path,
      status_code: payload.statusCode,
      actor_id: payload.actorId,
      actor_email: payload.actorEmail ?? null,
      actor_name: payload.actorName ?? null,
      auth_source: payload.authSource ?? null,
    });
    isAppLogTableEnsured = true;
  } catch (err) {
    logger.warn({ err }, 'Failed to write audit log to database');
  }
}
