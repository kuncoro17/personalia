import { Context } from 'hono';
import { ok, created, badRequest, notFound } from '../utils/response.helper';
import { logInfo, logWarn, logError } from '../utils/log.helper';
import { MasterGroupBankService } from '../services/masterGroupBankService';

const service = new MasterGroupBankService();

export const getAll = async (c: Context) => {
  try {
    await logInfo('Memulai ambil semua data master group bank');
    const data = await service.findAll();

    if (!data || data.length === 0) {
      await logWarn('Tidak ada data master group bank ditemukan', null);
      return notFound(c, 'Data tidak ditemukan');
    }

    await logInfo('Berhasil ambil semua data master group bank', null);
    return ok(c, data, 'Berhasil mengambil data');
  } catch (err: unknown) {
    await logError('Gagal ambil semua data master group bank', err);
    return badRequest(c, 'Gagal mengambil data', {
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};

export const getById = async (c: Context) => {
  const id = c.req.param('id');
  try {
    await logInfo(`Memulai ambil master group bank ID: ${id}`);
    const data = await service.findById(id);
    await logInfo(`Berhasil ambil master group bank ID: ${id}`, null);
    return ok(c, data, 'Berhasil mengambil data');
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    if (message.includes('tidak ditemukan')) {
      await logWarn(`Master group bank ID ${id} tidak ditemukan`, null);
      return notFound(c, 'Data tidak ditemukan');
    }

    await logError(`Gagal ambil master group bank ID: ${id}`, err);
    return badRequest(c, 'Gagal mengambil data', { message });
  }
};

export const create = async (c: Context) => {
  try {
    await logInfo('Memulai pembuatan master group bank baru');
    const body = await c.req.json();
    const data = await service.create(body);
    await logInfo('Master group bank berhasil dibuat', null);
    return created(c, data, 'Berhasil membuat data');
  } catch (err: unknown) {
    await logError('Gagal membuat master group bank', err);
    return badRequest(c, 'Gagal membuat data', {
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};

export const update = async (c: Context) => {
  const id = c.req.param('id');
  try {
    await logInfo(`Memulai update master group bank ID: ${id}`);
    const body = await c.req.json();
    const data = await service.update(id, body);
    await logInfo(`Master group bank ID ${id} berhasil diperbarui`, null);
    return ok(c, data, 'Berhasil memperbarui data');
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    if (message.includes('tidak ditemukan')) {
      await logWarn(`Master group bank ID ${id} tidak ditemukan`, null);
      return notFound(c, 'Data tidak ditemukan');
    }

    await logError(`Gagal update master group bank ID: ${id}`, err);
    return badRequest(c, 'Gagal memperbarui data', { message });
  }
};

export const remove = async (c: Context) => {
  const id = c.req.param('id');
  try {
    await logInfo(`Memulai hapus master group bank ID: ${id}`);
    const data = await service.delete(id);
    await logInfo(`Master group bank ID ${id} berhasil dihapus`, null);
    return ok(c, data, 'Berhasil menghapus data');
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    if (message.includes('tidak ditemukan')) {
      await logWarn(`Master group bank ID ${id} tidak ditemukan`, null);
      return notFound(c, 'Data tidak ditemukan');
    }

    await logError(`Gagal hapus master group bank ID: ${id}`, err);
    return badRequest(c, 'Gagal menghapus data', { message });
  }
};

export default { getAll, getById, create, update, remove };
