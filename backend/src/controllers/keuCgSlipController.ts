import { Context } from 'hono';
import service from '../services/keuCgSlipService';
import {
  badRequest,
  created,
  error,
  notFound,
  ok,
} from '../utils/response.helper';

const resolveClientIp = (c: Context): string | null => {
  const forwardedFor =
    c.req.header('cf-connecting-ip') ??
    c.req.header('x-real-ip') ??
    c.req.header('x-forwarded-for');
  if (forwardedFor) {
    const first = forwardedFor.split(',')[0]?.trim();
    if (first) return first;
  }

  return null;
};

const resolveError = (c: Context, err: unknown): Response => {
  const message =
    err instanceof Error ? err.message : 'Terjadi kesalahan internal';
  const candidateStatus =
    err && typeof err === 'object' && 'status' in err
      ? Number((err as { status?: unknown }).status)
      : undefined;
  const status = Number.isFinite(candidateStatus) ? candidateStatus : 400;

  if (status === 404) return notFound(c, message);
  if (status === 401) return c.json({ success: false, message }, 401);
  if (status === 403) return c.json({ success: false, message }, 403);
  if (status === 400) return badRequest(c, message);

  return error(c, message, 500);
};

export const getAll = async (c: Context): Promise<Response> => {
  try {
    const data = await service.getAll();
    return ok(c, data, 'Berhasil mengambil data');
  } catch (err: unknown) {
    return resolveError(c, err);
  }
};

export const getById = async (c: Context): Promise<Response> => {
  const id = Number(c.req.param('id'));
  if (!Number.isFinite(id)) return badRequest(c, 'ID harus berupa angka');

  try {
    const data = await service.getById(id);
    return ok(c, data, 'Berhasil mengambil data');
  } catch (err: unknown) {
    return resolveError(c, err);
  }
};

export const create = async (c: Context): Promise<Response> => {
  try {
    const body = await c.req.json();
    const ip = resolveClientIp(c);
    const payload = ip ? { ...body, ip } : body;
    const data = await service.create(payload);
    return created(c, data, 'Berhasil membuat data');
  } catch (err: unknown) {
    return resolveError(c, err);
  }
};

export const update = async (c: Context): Promise<Response> => {
  const id = Number(c.req.param('id'));
  if (!Number.isFinite(id)) return badRequest(c, 'ID harus berupa angka');

  try {
    const body = await c.req.json();
    const ip = resolveClientIp(c);
    const payload = ip ? { ...body, ip } : body;
    const data = await service.update(id, payload);
    return ok(c, data, 'Berhasil memperbarui data');
  } catch (err: unknown) {
    return resolveError(c, err);
  }
};

export const remove = async (c: Context): Promise<Response> => {
  const id = Number(c.req.param('id'));
  if (!Number.isFinite(id)) return badRequest(c, 'ID harus berupa angka');

  try {
    await service.delete(id);
    return ok(c, null, 'Berhasil menghapus data');
  } catch (err: unknown) {
    return resolveError(c, err);
  }
};

export default { getAll, getById, create, update, remove };
