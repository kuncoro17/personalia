import { Context } from 'hono';
import { HTTPException as HonoHTTPException } from 'hono/http-exception';
import { HTTP_STATUS, HttpStatusCode } from '../utils/http-status';
import { HttpException as AppHttpException } from '../utils/http-exception';

export class HttpError extends Error {
  status: HttpStatusCode;
  constructor(
    message: string,
    status: HttpStatusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR
  ) {
    super(message);
    this.status = status;
  }
}

const isValidStatusCode = (value: unknown): value is HttpStatusCode =>
  typeof value === 'number' && value >= 100 && value <= 599;

const resolveStatus = (err: unknown): HttpStatusCode => {
  if (err instanceof HttpError && isValidStatusCode(err.status)) {
    return err.status;
  }

  if (err instanceof AppHttpException && isValidStatusCode(err.status)) {
    return err.status;
  }

  if (err instanceof HonoHTTPException && isValidStatusCode(err.status)) {
    return err.status;
  }

  if (err && typeof err === 'object') {
    const candidate = err as { status?: unknown; statusCode?: unknown };
    if (isValidStatusCode(candidate.status)) return candidate.status;
    if (isValidStatusCode(candidate.statusCode)) return candidate.statusCode;
  }

  return HTTP_STATUS.INTERNAL_SERVER_ERROR;
};

export const errorHandler = (err: unknown, c: Context) => {
  const message =
    err instanceof Error ? err.message : 'Terjadi kesalahan internal';
  const status = resolveStatus(err);
  const requestOrigin = c.req.header('origin');
  const allowOrigin = requestOrigin || '*';

  const response = c.json(
    { status: 'fail', message },
    { status } // sekarang sudah type-safe
  );

  response.headers.set('Access-Control-Allow-Origin', allowOrigin);
  response.headers.set(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE, OPTIONS'
  );
  response.headers.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization'
  );

  if (requestOrigin) {
    const vary = response.headers.get('Vary');
    if (!vary) {
      response.headers.set('Vary', 'Origin');
    } else if (
      !vary
        .toLowerCase()
        .split(',')
        .some(value => value.trim() === 'origin')
    ) {
      response.headers.set('Vary', `${vary}, Origin`);
    }
  }

  return response;
};
