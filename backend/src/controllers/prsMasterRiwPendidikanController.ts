import { Context } from 'hono';
import service from '../services/prsMasterRiwPendidikanService';
import { ok, created, badRequest, notFound } from '../utils/response.helper';
import { logInfo, logWarn, logError } from '../utils/log.helper';

export const getAll = async (c: Context) => {
  try {
    await logInfo('Memulai ambil semua data');
    const data = await service.getAll();

    await logInfo('Berhasil ambil semua data', null);
    return ok(c, data, 'Berhasil mengambil semua data');
  } catch (err: unknown) {
    await logError('Gagal ambil semua data', err);
    return badRequest(c, 'Gagal mengambil data', {
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};

export const getById = async (c: Context) => {
  const id = c.req.param('id');
  try {
    await logInfo(`Memulai ambil data ID: ${id}`);
    const data = await service.getById(id);

    await logInfo(`Berhasil ambil data ID: ${id}`, null);
    return ok(c, data, 'Berhasil mengambil data');
  } catch (err: unknown) {
    if (err instanceof Error && err.message.includes('tidak ditemukan')) {
      await logWarn(`Data dengan ID ${id} tidak ditemukan`, null);
      return notFound(c, err.message);
    }
    await logError(`Gagal ambil data ID: ${id}`, err);
    return badRequest(c, 'Gagal mengambil data', {
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};

export const create = async (c: Context) => {
  try {
    await logInfo('Memulai pembuatan data baru');
    const body = await c.req.json();
    const createdData = await service.create(body);

    await logInfo(`Data berhasil dibuat dengan ID: ${createdData.id}`, null);
    return created(c, createdData, 'Data berhasil dibuat');
  } catch (err: unknown) {
    await logError('Gagal membuat data', err);
    return badRequest(c, 'Gagal membuat data', {
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};

export const update = async (c: Context) => {
  const id = c.req.param('id');
  try {
    await logInfo(`Memulai update data ID: ${id}`);
    const body = await c.req.json();
    const updated = await service.update(id, body);

    await logInfo(`Data berhasil diperbarui ID: ${id}`, null);
    return ok(c, updated, 'Data berhasil diperbarui');
  } catch (err: unknown) {
    await logError(`Gagal update data ID: ${id}`, err);
    return badRequest(c, 'Gagal memperbarui data', {
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};

export const remove = async (c: Context) => {
  const id = c.req.param('id');
  try {
    await logInfo(`Memulai hapus data ID: ${id}`);
    const deleted = await service.delete(id);

    await logInfo(`Data berhasil dihapus ID: ${id}`, null);
    return ok(c, deleted, 'Data berhasil dihapus');
  } catch (err: unknown) {
    await logError(`Gagal hapus data ID: ${id}`, err);
    return badRequest(c, 'Gagal menghapus data', {
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};

export default { getAll, getById, create, update, remove };
