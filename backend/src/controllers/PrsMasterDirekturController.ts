import { Context } from 'hono';
import service from '../services/PrsMasterDirekturService';
import { ok, created, badRequest, notFound } from '../utils/response.helper';
import { logInfo, logWarn, logError } from '../utils/log.helper';

export const getAll = async (c: Context) => {
  try {
    await logInfo('Memulai ambil semua data Dirpel');
    const data = await service.getAll();

    if (!data || data.length === 0) {
      await logWarn('Tidak ada data Dirpel ditemukan');
      return notFound(c, 'Data tidak ditemukan');
    }

    await logInfo('Berhasil ambil semua data Dirpel');
    return ok(c, data, 'Berhasil mengambil semua data Dirpel');
  } catch (err: unknown) {
    await logError('Gagal ambil semua data Dirpel', err);
    return badRequest(c, 'Gagal mengambil data Dirpel', {
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};

export const getById = async (c: Context) => {
  const id = c.req.param('id');
  try {
    await logInfo(`Memulai ambil data Dirpel ID: ${id}`);
    const data = await service.getById(id);

    if (!data) {
      await logWarn(`Data Dirpel ID ${id} tidak ditemukan`);
      return notFound(c, 'Data tidak ditemukan');
    }

    await logInfo(`Berhasil ambil data Dirpel ID: ${id}`);
    return ok(c, data, 'Berhasil mengambil data Dirpel');
  } catch (err: unknown) {
    await logError(`Gagal ambil data Dirpel ID: ${id}`, err);
    return badRequest(c, 'Gagal mengambil data Dirpel', {
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};

export const create = async (c: Context) => {
  try {
    await logInfo('Memulai pembuatan data Dirpel baru');
    const body = await c.req.json();
    const data = await service.create(body);

    await logInfo('Data Dirpel berhasil dibuat');
    return created(c, data, 'Data Dirpel berhasil dibuat');
  } catch (err: unknown) {
    await logError('Gagal membuat data Dirpel', err);
    return badRequest(c, 'Gagal menambahkan data Dirpel', {
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};

export const update = async (c: Context) => {
  const id = c.req.param('id');
  try {
    await logInfo(`Memulai update data Dirpel ID: ${id}`);
    const body = await c.req.json();
    const data = await service.update(id, body);

    if (!data) {
      await logWarn(`Data Dirpel ID ${id} tidak ditemukan`);
      return notFound(c, 'Data tidak ditemukan');
    }

    await logInfo(`Data Dirpel ID ${id} berhasil diperbarui`);
    return ok(c, data, 'Data Dirpel berhasil diperbarui');
  } catch (err: unknown) {
    await logError(`Gagal update data Dirpel ID: ${id}`, err);
    return badRequest(c, 'Gagal memperbarui data Dirpel', {
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};

export const remove = async (c: Context) => {
  const id = c.req.param('id');
  try {
    await logInfo(`Memulai hapus data Dirpel ID: ${id}`);
    const data = await service.delete(id);

    if (!data) {
      await logWarn(`Data Dirpel ID ${id} tidak ditemukan`);
      return notFound(c, 'Data tidak ditemukan');
    }

    await logInfo(`Data Dirpel ID ${id} berhasil dihapus`);
    return ok(c, data, 'Data Dirpel berhasil dihapus');
  } catch (err: unknown) {
    await logError(`Gagal hapus data Dirpel ID: ${id}`, err);
    return badRequest(c, 'Gagal menghapus data Dirpel', {
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};
