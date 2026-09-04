import { Context } from 'hono';
import service from '../services/prsPengalamanService';
import { ok, created, badRequest, notFound } from '../utils/response.helper';
import { logInfo, logWarn, logError } from '../utils/log.helper';

export const getAll = async (c: Context): Promise<Response> => {
  try {
    const data = await service.findAll();
    await logInfo('Berhasil ambil semua pengalaman kerja', null);
    return ok(c, data, 'Berhasil mengambil semua data');
  } catch (err: unknown) {
    await logError('Gagal ambil semua pengalaman kerja', err);
    return badRequest(c, 'Gagal mengambil data', {
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};

export const getById = async (c: Context): Promise<Response> => {
  const id = c.req.param('id');
  try {
    const data = await service.findById(id);
    await logInfo(`Berhasil ambil pengalaman kerja ID: ${id}`, null);
    return ok(c, data, 'Berhasil mengambil data');
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'NotFoundException') {
      await logWarn(`Pengalaman kerja ID ${id} tidak ditemukan`, null);
      return notFound(c, 'Data tidak ditemukan');
    }

    await logError(`Gagal ambil pengalaman kerja ID: ${id}`, err);
    return badRequest(c, 'Gagal mengambil data', {
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};

export const create = async (c: Context): Promise<Response> => {
  try {
    const body = await c.req.json();
    const data = await service.create(body);

    await logInfo(`Pengalaman kerja berhasil dibuat ID: ${data.id}`, null);
    return created(c, data, 'Data berhasil dibuat');
  } catch (err: unknown) {
    await logError('Gagal membuat pengalaman kerja', err);
    return badRequest(c, 'Gagal membuat data', {
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};

export const update = async (c: Context): Promise<Response> => {
  const id = c.req.param('id');
  try {
    const body = await c.req.json();
    const data = await service.update(id, body);

    await logInfo(`Pengalaman kerja berhasil diperbarui ID: ${id}`, null);
    return ok(c, data, 'Data berhasil diperbarui');
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'NotFoundException') {
      await logWarn(`Pengalaman kerja ID ${id} tidak ditemukan`, null);
      return notFound(c, 'Data tidak ditemukan');
    }

    await logError(`Gagal update pengalaman kerja ID: ${id}`, err);
    return badRequest(c, 'Gagal memperbarui data', {
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};

export const remove = async (c: Context): Promise<Response> => {
  const id = c.req.param('id');
  try {
    const deleted = await service.delete(id);

    await logInfo(`Pengalaman kerja berhasil dihapus ID: ${id}`, null);
    return ok(c, { deleted }, 'Data berhasil dihapus');
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'NotFoundException') {
      await logWarn(`Pengalaman kerja ID ${id} tidak ditemukan`, null);
      return notFound(c, 'Data tidak ditemukan');
    }

    await logError(`Gagal hapus pengalaman kerja ID: ${id}`, err);
    return badRequest(c, 'Gagal menghapus data', {
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};

export default {
  getAll,
  getById,
  create,
  update,
  remove,
};
