import { Context } from 'hono';
import { ok, created, badRequest, notFound } from '../utils/response.helper';
import { logInfo, logWarn, logError } from '../utils/log.helper';
import { MasterBankGiroService } from '../services/masterBankGiroService';

const service = new MasterBankGiroService();

export const getAll = async (c: Context) => {
  try {
    await logInfo('Memulai ambil semua data master bank giro');
    const data = await service.findAll();

    if (!data || data.length === 0) {
      await logWarn('Tidak ada data master bank giro ditemukan', null);
      return notFound(c, 'Data tidak ditemukan');
    }

    await logInfo('Berhasil ambil semua data master bank giro', null);
    return ok(c, data, 'Berhasil mengambil data');
  } catch (err: unknown) {
    await logError('Gagal ambil semua data master bank giro', err);
    return badRequest(c, 'Gagal mengambil data', {
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};

export const getById = async (c: Context) => {
  const id = c.req.param('id');
  try {
    await logInfo(`Memulai ambil master bank giro ID: ${id}`);
    const data = await service.findById(id);
    await logInfo(`Berhasil ambil master bank giro ID: ${id}`, null);
    return ok(c, data, 'Berhasil mengambil data');
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    if (message.includes('tidak ditemukan')) {
      await logWarn(`Master bank giro ID ${id} tidak ditemukan`, null);
      return notFound(c, 'Data tidak ditemukan');
    }

    await logError(`Gagal ambil master bank giro ID: ${id}`, err);
    return badRequest(c, 'Gagal mengambil data', { message });
  }
};

export const create = async (c: Context) => {
  try {
    await logInfo('Memulai pembuatan master bank giro baru');
    const body = await c.req.json();
    const data = await service.create(body);
    await logInfo('Master bank giro berhasil dibuat', null);
    return created(c, data, 'Berhasil membuat data');
  } catch (err: unknown) {
    await logError('Gagal membuat master bank giro', err);
    return badRequest(c, 'Gagal membuat data', {
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};

export const update = async (c: Context) => {
  const id = c.req.param('id');
  try {
    await logInfo(`Memulai update master bank giro ID: ${id}`);
    const body = await c.req.json();
    const data = await service.update(id, body);
    await logInfo(`Master bank giro ID ${id} berhasil diperbarui`, null);
    return ok(c, data, 'Berhasil memperbarui data');
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    if (message.includes('tidak ditemukan')) {
      await logWarn(`Master bank giro ID ${id} tidak ditemukan`, null);
      return notFound(c, 'Data tidak ditemukan');
    }

    await logError(`Gagal update master bank giro ID: ${id}`, err);
    return badRequest(c, 'Gagal memperbarui data', { message });
  }
};

export const remove = async (c: Context) => {
  const id = c.req.param('id');
  try {
    await logInfo(`Memulai hapus master bank giro ID: ${id}`);
    const data = await service.delete(id);
    await logInfo(`Master bank giro ID ${id} berhasil dihapus`, null);
    return ok(c, data, 'Berhasil menghapus data');
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    if (message.includes('tidak ditemukan')) {
      await logWarn(`Master bank giro ID ${id} tidak ditemukan`, null);
      return notFound(c, 'Data tidak ditemukan');
    }

    await logError(`Gagal hapus master bank giro ID: ${id}`, err);
    return badRequest(c, 'Gagal menghapus data', { message });
  }
};

export default { getAll, getById, create, update, remove };
