import { Context } from 'hono';
import { ok, created, badRequest, notFound } from '../utils/response.helper';
import { logInfo, logWarn, logError } from '../utils/log.helper';
import { PrsMasterProvService } from '../services/prsMasterProvService';

const service = new PrsMasterProvService();

export const getAllProvinsi = async (c: Context) => {
  try {
    await logInfo('Memulai ambil semua provinsi');
    const data = await service.findAll();

    await logInfo('Berhasil ambil semua provinsi', null);
    return ok(c, data, 'Berhasil mengambil semua provinsi');
  } catch (err: unknown) {
    await logError('Gagal ambil semua provinsi', err);
    return badRequest(c, 'Gagal mengambil provinsi', {
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};

export const getProvinsiById = async (c: Context) => {
  const id = c.req.param('id');
  try {
    await logInfo(`Memulai ambil provinsi ID: ${id}`);
    const data = await service.findById(id);

    if (!data) {
      await logWarn(`Provinsi dengan ID ${id} tidak ditemukan`, null);
      return notFound(c, 'Provinsi tidak ditemukan');
    }
    await logInfo(`Berhasil ambil provinsi ID: ${id}`, null);
    return ok(c, data, 'Berhasil mengambil provinsi');
  } catch (err: unknown) {
    await logError(`Gagal ambil provinsi ID: ${id}`, err);
    return badRequest(c, 'Gagal mengambil provinsi', {
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};

export const createProvinsi = async (c: Context) => {
  try {
    await logInfo('Memulai pembuatan provinsi baru');

    const body = await c.req.json();
    const plain = await service.create(body); // service sudah return plain object

    await logInfo(`Provinsi berhasil dibuat dengan ID: ${plain.id}`, null);

    return created(c, plain, 'Provinsi berhasil dibuat');
  } catch (err: unknown) {
    await logError('Gagal membuat provinsi', err);

    return badRequest(c, 'Gagal membuat provinsi', {
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};

export const updateProvinsi = async (c: Context) => {
  const id = c.req.param('id');
  try {
    await logInfo(`Memulai update provinsi ID: ${id}`);
    const body = await c.req.json();
    const data = await service.update(id, body);

    await logInfo(`Provinsi berhasil diperbarui ID: ${id}`, null);
    return ok(c, data, 'Provinsi berhasil diperbarui');
  } catch (err: unknown) {
    await logError(`Gagal update provinsi ID: ${id}`, err);
    return badRequest(c, 'Gagal memperbarui provinsi', {
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};

export const deleteProvinsi = async (c: Context) => {
  const id = c.req.param('id');
  try {
    await logInfo(`Memulai hapus provinsi ID: ${id}`);
    const data = await service.delete(id);

    await logInfo(`Provinsi berhasil dihapus ID: ${id}`, null);
    return ok(c, data, 'Provinsi berhasil dihapus');
  } catch (err: unknown) {
    await logError(`Gagal hapus provinsi ID: ${id}`, err);
    return badRequest(c, 'Gagal menghapus provinsi', {
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};
