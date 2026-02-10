import { Context } from 'hono';
import { ok, created, badRequest, notFound } from '../utils/response.helper';
import { logInfo, logWarn, logError } from '../utils/log.helper';
import { prsKontakDaruratService } from '../services/prsKontakDaruratService';

export const getAllKontakDarurat = async (c: Context): Promise<Response> => {
  try {
    const data = await prsKontakDaruratService.getAll();

    if (!data || data.length === 0) {
      await logWarn('Tidak ada data kontak darurat ditemukan', null);
      return notFound(c, 'Tidak ada data kontak darurat ditemukan');
    }

    await logInfo('Berhasil ambil semua data kontak darurat', null);
    return ok(c, data, 'Berhasil mengambil semua kontak darurat');
  } catch (err: unknown) {
    await logError('Gagal ambil data kontak darurat', err);

    return badRequest(c, 'Gagal mengambil data kontak darurat', {
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};

export const getKontakDaruratById = async (c: Context): Promise<Response> => {
  const id = c.req.param('id');
  try {
    const data = await prsKontakDaruratService.getById(id);

    await logInfo(`Berhasil ambil kontak darurat ID: ${id}`, null);
    return ok(c, data, 'Berhasil mengambil kontak darurat');
  } catch (err: unknown) {
    await logError(`Gagal ambil kontak darurat ID: ${id}`, err);
    return notFound(c, err instanceof Error ? err.message : 'Unknown error');
  }
};

export const createKontakDarurat = async (c: Context): Promise<Response> => {
  try {
    const body = await c.req.json();
    const newData = await prsKontakDaruratService.create(body);

    await logInfo('Kontak darurat berhasil dibuat', null);
    return created(c, newData, 'Kontak darurat berhasil ditambahkan');
  } catch (err: unknown) {
    await logError('Gagal membuat kontak darurat', err);
    return notFound(c, err instanceof Error ? err.message : 'Unknown error');
  }
};

export const updateKontakDarurat = async (c: Context): Promise<Response> => {
  const id = c.req.param('id');
  try {
    const body = await c.req.json();
    const updated = await prsKontakDaruratService.update(id, body);

    await logInfo(`Kontak darurat ID ${id} berhasil diperbarui`, null);
    return ok(c, updated, 'Kontak darurat berhasil diperbarui');
  } catch (err: unknown) {
    await logError(`Gagal update kontak darurat ID: ${id}`, err);
    return notFound(c, err instanceof Error ? err.message : 'Unknown error');
  }
};

export const deleteKontakDarurat = async (c: Context): Promise<Response> => {
  const id = c.req.param('id');
  try {
    await prsKontakDaruratService.delete(id);

    await logInfo(`Kontak darurat ID ${id} berhasil dihapus`, null);
    return ok(c, null, 'Kontak darurat berhasil dihapus');
  } catch (err: unknown) {
    await logError(`Gagal hapus kontak darurat ID: ${id}`, err);
    return notFound(c, err instanceof Error ? err.message : 'Unknown error');
  }
};

export default {
  getAllKontakDarurat,
  getKontakDaruratById,
  createKontakDarurat,
  updateKontakDarurat,
  deleteKontakDarurat,
};
