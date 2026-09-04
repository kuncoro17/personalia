import { Context } from 'hono';
import * as service from '../services/prsTipeDokumenService';
import { logInfo, logError } from '../utils/log.helper';
import { ok, created, badRequest, notFound } from '../utils/response.helper';

// ---- GET ALL ----
export const getAll = async (c: Context): Promise<Response> => {
  try {
    const result = await service.getAll();
    await logInfo('Berhasil ambil semua tipe dokumen', null);
    return ok(c, result);
  } catch (err: unknown) {
    await logError('Gagal ambil semua tipe dokumen', err);
    return badRequest(c, err instanceof Error ? err.message : 'Unknown error');
  }
};

// ---- GET BY ID ----
export const getTipeDokumen = async (c: Context): Promise<Response> => {
  const id = c.req.param('id');
  try {
    const result = await service.getById(id);
    await logInfo(`Tipe dokumen ID ${id} berhasil diambil`, null);
    return ok(c, result);
  } catch (err: unknown) {
    await logError(`Gagal ambil tipe dokumen ID ${id}`, err);
    return notFound(c, err instanceof Error ? err.message : 'Unknown error');
  }
};

// ---- CREATE ----
export const createTipeDokumen = async (c: Context): Promise<Response> => {
  try {
    const body = await c.req.json();
    const result = await service.create({ tipe_dokumen: body['tipe_dokumen'] });
    await logInfo('Tipe dokumen berhasil dibuat', null);
    return created(c, result, 'Tipe dokumen berhasil dibuat');
  } catch (err: unknown) {
    await logError('Gagal membuat tipe dokumen', err);
    return badRequest(c, err instanceof Error ? err.message : 'Unknown error');
  }
};

// ---- UPDATE ----
export const updateTipeDokumen = async (c: Context): Promise<Response> => {
  const id = c.req.param('id');
  try {
    const body = await c.req.json();
    const result = await service.updateTipeDokumenService(id, body);

    await logInfo(`Tipe dokumen ID ${id} berhasil diperbarui`, null);
    return ok(c, result, 'Tipe dokumen berhasil diperbarui');
  } catch (err: unknown) {
    await logError(`Gagal update tipe dokumen ID ${id}`, err);
    const message = err instanceof Error ? err.message : 'Unknown error';
    return message.includes('tidak ditemukan')
      ? notFound(c, message)
      : badRequest(c, message);
  }
};

// ---- DELETE ----
export const deleteTipeDokumen = async (c: Context): Promise<Response> => {
  const id = c.req.param('id');
  try {
    const result = await service.remove(id);
    await logInfo(`Tipe dokumen ID ${id} berhasil dihapus`, null);
    return ok(c, result, 'Tipe dokumen berhasil dihapus');
  } catch (err: unknown) {
    await logError(`Gagal hapus tipe dokumen ID ${id}`, err);
    return notFound(c, err instanceof Error ? err.message : 'Unknown error');
  }
};
