import { Context } from 'hono';
import service from '../services/prsBagianService';
import { ok, created, badRequest, notFound } from '../utils/response.helper';
import { logInfo, logWarn, logError } from '../utils/log.helper';

const getErrorMessage = (err: unknown): string =>
  err instanceof Error ? err.message : 'Unknown error';

export const getAll = async (c: Context): Promise<Response> => {
  try {
    await logInfo('Memulai ambil semua bagian');

    const data = await service.getAll();

    await logInfo('Berhasil ambil semua bagian', null);
    return ok(c, data, 'Berhasil mengambil semua bagian');
  } catch (err: unknown) {
    await logError('Gagal ambil semua bagian', err);
    return badRequest(c, 'Gagal mengambil semua bagian', {
      message: getErrorMessage(err),
    });
  }
};

export const getById = async (c: Context): Promise<Response> => {
  const id = c.req.param('id');
  try {
    await logInfo(`Memulai ambil bagian ID: ${id}`);

    const data = await service.getById(id);

    if (!data) {
      await logWarn(`Bagian dengan ID ${id} tidak ditemukan`, null);
      return notFound(c, 'Bagian tidak ditemukan');
    }

    await logInfo(`Berhasil ambil bagian ID: ${id}`, null);
    return ok(c, data, 'Berhasil mengambil bagian');
  } catch (err: unknown) {
    await logError(`Gagal ambil bagian ID: ${id}`, err);
    return badRequest(c, 'Gagal mengambil bagian', {
      message: getErrorMessage(err),
    });
  }
};

export const create = async (c: Context): Promise<Response> => {
  try {
    const body = await c.req.json();

    await logInfo('Memulai pembuatan bagian baru');
    const createdData = await service.create(body);
    const plain = createdData.toJSON ? createdData.toJSON() : createdData;

    await logInfo(`Bagian berhasil dibuat dengan ID: ${plain.bag_id}`, null);

    return created(c, plain, 'Bagian berhasil dibuat');
  } catch (err: unknown) {
    await logError('Gagal membuat bagian', err);
    return badRequest(c, 'Gagal membuat bagian', {
      message: getErrorMessage(err),
    });
  }
};

export const update = async (c: Context): Promise<Response> => {
  const id = c.req.param('id');
  try {
    const body = await c.req.json();
    await logInfo(`Memulai update bagian ID: ${id}`);

    const result = await service.update(id, body);

    await logInfo(`Bagian ID: ${id} berhasil diperbarui`, null);
    return ok(c, result, 'Bagian berhasil diperbarui');
  } catch (err: unknown) {
    await logError(`Gagal memperbarui bagian ID: ${id}`, err);
    return badRequest(c, 'Gagal memperbarui bagian', {
      message: getErrorMessage(err),
    });
  }
};

export const remove = async (c: Context): Promise<Response> => {
  const id = c.req.param('id');
  try {
    await logInfo(`Memulai hapus bagian ID: ${id}`);

    await service.delete(id);

    await logInfo(`Bagian ID: ${id} berhasil dihapus`, null);
    return ok(c, null, 'Bagian berhasil dihapus');
  } catch (err: unknown) {
    await logError(`Gagal hapus bagian ID: ${id}`, err);
    return badRequest(c, 'Gagal menghapus bagian', {
      message: getErrorMessage(err),
    });
  }
};
export const getUnitKerjaByDivisi = async (c: Context) => {
  const kode_divisi = c.req.param('kode_divisi');

  if (!kode_divisi || kode_divisi.trim() === '') {
    return c.json({ error: 'kode_divisi harus diisi' }, 400);
  }

  try {
    const data = await service.getUnitKerjaByDivisi(kode_divisi.trim());
    return c.json({ data });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : 'Gagal mengambil data unit kerja';

    return c.json({ error: message }, 500);
  }
};
