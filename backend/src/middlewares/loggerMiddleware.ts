import { MiddlewareHandler } from 'hono';
import logger from '../utils/logger';
import type { ClerkAuthPayload } from '../types/clerk';
import { saveAuditLogToDB } from '../utils/dbLogger';
import { extractEmailFromClerkPayload } from './clerkAuth';

type AuditAction = 'READ' | 'CREATE' | 'UPDATE';
type AuditAuthPayload = ClerkAuthPayload & {
  id?: string;
  user_id?: string;
  userId?: string;
  name?: string;
  full_name?: string;
  auth_source?: string;
  sas_auto_login?: boolean;
};

const ACTION_BY_METHOD: Partial<Record<string, AuditAction>> = {
  GET: 'READ',
  POST: 'CREATE',
  PUT: 'UPDATE',
  PATCH: 'UPDATE',
};

const IGNORED_PATH_PREFIXES = [
  '/auth/',
  '/dok',
  '/health',
  '/openapi.json',
  '/redis',
  '/swagger',
  '/uploads',
];

const getActorId = (auth: AuditAuthPayload): string | null => {
  const candidates = [auth.id, auth.user_id, auth.userId, auth.sub];

  return (
    candidates
      .find(value => typeof value === 'string' && value.trim().length > 0)
      ?.trim() ?? null
  );
};

const getActorName = (auth: AuditAuthPayload): string | null => {
  const value = auth.name ?? auth.full_name;

  return typeof value === 'string' && value.trim() ? value.trim() : null;
};

const shouldAudit = (method: string, path: string, status: number): boolean => {
  if (!ACTION_BY_METHOD[method]) return false;
  if (status < 200 || status >= 400) return false;

  return !IGNORED_PATH_PREFIXES.some(prefix => path.startsWith(prefix));
};

export const requestLogger: MiddlewareHandler<{
  Variables: { auth?: AuditAuthPayload };
}> = async (c, next) => {
  const startedAt = performance.now();
  logger.info(`[${c.req.method}] ${c.req.url}`);
  await next();

  const method = c.req.method.toUpperCase();
  const path = c.req.path;
  const status = c.res.status;
  const auth = c.get('auth');
  const action = ACTION_BY_METHOD[method];

  if (!auth || !action || !shouldAudit(method, path, status)) return;

  const actorId = getActorId(auth);
  if (!actorId) return;

  await saveAuditLogToDB({
    action,
    method,
    path,
    statusCode: status,
    responseTime: Math.round(performance.now() - startedAt),
    actorId,
    actorEmail: extractEmailFromClerkPayload(auth),
    actorName: getActorName(auth),
    authSource: auth.sas_auto_login
      ? 'sas'
      : auth.auth_source || (auth.sub ? 'clerk' : 'internal'),
  });
};
