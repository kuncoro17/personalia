import { Context } from 'hono';
import { ok, created, badRequest, notFound } from '../utils/response.helper';
import { logError, logInfo, logWarn } from '../utils/log.helper';
import PrsMasterSetempatService from '../services/prsMasterSetempatService';

export const getAllSetempat = async (c: Context): Promise<Response> => {
  try {
    await logInfo('Memulai ambil semua data setempat');

    const data = await PrsMasterSetempatService.findAll();
    if (!data || data.length === 0) {
      await logWarn('Tidak ada data setempat ditemukan', null);
      return notFound(c, 'Data setempat tidak ditemukan');
    }

    await logInfo('Berhasil ambil semua data setempat', null);
    return ok(c, data, 'Berhasil mengambil semua data setempat');
  } catch (err: unknown) {
    await logError('Gagal ambil semua data setempat', err);
    return badRequest(c, 'Gagal mengambil data setempat', {
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};

export const getSetempatById = async (c: Context): Promise<Response> => {
  const id = c.req.param('id');
  try {
    await logInfo(`Memulai ambil setempat ID: ${id}`);

    const data = await PrsMasterSetempatService.findById(id);
    if (!data) {
      await logWarn(`Setempat dengan ID ${id} tidak ditemukan`, null);
      return notFound(c, 'Data setempat tidak ditemukan');
    }

    await logInfo(`Berhasil ambil setempat ID: ${id}`, null);
    return ok(c, data, 'Berhasil mengambil data setempat');
  } catch (err: unknown) {
    await logError(`Gagal ambil setempat ID: ${id}`, err);
    return badRequest(c, 'Gagal mengambil data setempat', {
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};

export const createSetempat = async (c: Context): Promise<Response> => {
  try {
    await logInfo('Memulai pembuatan setempat baru');

    const body = await c.req.json();
    const data = await PrsMasterSetempatService.create(body);

    await logInfo('Setempat berhasil dibuat', null);
    return created(c, data, 'Setempat berhasil ditambahkan');
  } catch (err: unknown) {
    await logError('Gagal membuat setempat', err);
    return badRequest(c, 'Gagal menambahkan setempat', {
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};

export const updateSetempat = async (c: Context): Promise<Response> => {
  const id = c.req.param('id');
  try {
    await logInfo(`Memulai update setempat ID: ${id}`);

    const body = await c.req.json();
    const data = await PrsMasterSetempatService.update(id, body);

    if (!data) {
      await logWarn(`Setempat dengan ID ${id} tidak ditemukan`, null);
      return notFound(c, 'Data setempat tidak ditemukan');
    }

    await logInfo(`Setempat ID ${id} berhasil diperbarui`, null);
    return ok(c, data, 'Data berhasil diperbarui');
  } catch (err: unknown) {
    await logError(`Gagal update setempat ID: ${id}`, err);
    return badRequest(c, 'Gagal memperbarui data setempat', {
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};

export const deleteSetempat = async (c: Context): Promise<Response> => {
  const id = c.req.param('id');
  try {
    await logInfo(`Memulai hapus setempat ID: ${id}`);

    const data = await PrsMasterSetempatService.delete(id);
    if (!data) {
      await logWarn(`Setempat dengan ID ${id} tidak ditemukan`, null);
      return notFound(c, 'Data setempat tidak ditemukan');
    }

    await logInfo(`Setempat ID ${id} berhasil dihapus`, null);
    return ok(c, data, 'Data berhasil dihapus');
  } catch (err: unknown) {
    await logError(`Gagal hapus setempat ID: ${id}`, err);
    return badRequest(c, 'Gagal menghapus data setempat', {
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};
