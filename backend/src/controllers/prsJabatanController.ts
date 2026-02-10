import { Context } from 'hono';
import { PrsJabatanService } from '../services/prsJabatanService';
import { ok, created, notFound, badRequest } from '../utils/response.helper';

const service = new PrsJabatanService();

export const getAllJabatan = async (c: Context) => {
  try {
    const result = await service.getAll();
    return ok(c, result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Terjadi kesalahan';
    return badRequest(c, message);
  }
};

export const getJabatanById = async (c: Context) => {
  const id = c.req.param('id');
  try {
    const result = await service.getById(id);
    return ok(c, result);
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Data jabatan tidak ditemukan';
    return notFound(c, message);
  }
};

export const createJabatan = async (c: Context) => {
  try {
    const body = await c.req.json<Record<string, unknown>>();
    const result = await service.create(body);
    return created(c, result);
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Gagal membuat data jabatan';
    return badRequest(c, message);
  }
};

export const updateJabatan = async (c: Context) => {
  const id = c.req.param('id');
  try {
    const body = await c.req.json<Record<string, unknown>>();
    const result = await service.update(id, body);
    return ok(c, result);
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Gagal memperbarui data jabatan';
    return badRequest(c, message);
  }
};

export const deleteJabatan = async (c: Context) => {
  const id = c.req.param('id');
  try {
    const result = await service.delete(id);
    return ok(c, result);
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Gagal menghapus data jabatan';
    return notFound(c, message);
  }
};
