import { Context } from 'hono';
import * as service from '../services/prsDivisiService';
import { ok, created, badRequest } from '../utils/response.helper';
import { logInfo, logError } from '../utils/log.helper';

export const getAll = async (c: Context) => {
  try {
    await logInfo('Memulai ambil seluruh data divisi');
    const data = await service.getAll();

    await logInfo('Berhasil ambil seluruh data divisi', null);
    return ok(c, data, 'Berhasil mengambil seluruh data divisi');
  } catch (err: unknown) {
    await logError('Gagal mengambil seluruh data divisi', err);
    return badRequest(c, 'Gagal mengambil data divisi', {
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};

export const getById = async (c: Context) => {
  const id = c.req.param('id');
  try {
    await logInfo(`Memulai ambil data divisi dengan ID: ${id}`);
    const data = await service.getById(id);

    await logInfo(`Berhasil ambil data divisi dengan ID: ${id}`, null);
    return ok(c, data, `Berhasil mengambil data divisi ${id}`);
  } catch (err: unknown) {
    await logError(`Gagal ambil data divisi dengan ID: ${id}`, err);
    return badRequest(c, 'Gagal mengambil data divisi', {
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};

export const create = async (c: Context) => {
  const id = c.req.param('id');

  try {
    await logInfo('Memulai pembuatan divisi baru');

    const body = await c.req.json();
    const data = await service.create(body);

    // ambil data plain object
    const plainData = data.toJSON();

    await logInfo(`Divisi berhasil dibuat dengan ID: ${id}`, null);

    return created(c, plainData, 'Divisi berhasil ditambahkan');
  } catch (err: unknown) {
    await logError('Gagal membuat divisi', err);
    return badRequest(c, 'Gagal menambahkan divisi', {
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};
export const update = async (c: Context) => {
  const id = c.req.param('id');
  try {
    await logInfo(`Memulai update divisi dengan ID: ${id}`);
    const body = await c.req.json();
    const data = await service.update(id, body);

    await logInfo(`Divisi berhasil diperbarui dengan ID: ${id}`, null);
    return ok(c, data, 'Divisi berhasil diperbarui');
  } catch (err: unknown) {
    await logError(`Gagal memperbarui divisi dengan ID: ${id}`, err);
    return badRequest(c, 'Gagal memperbarui divisi', {
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};

export const remove = async (c: Context) => {
  const id = c.req.param('id');
  try {
    await logInfo(`Memulai hapus divisi dengan ID: ${id}`);
    await service.remove(id);

    await logInfo(`Divisi berhasil dihapus dengan ID: ${id}`, null);
    return ok(c, null, 'Divisi berhasil dihapus');
  } catch (err: unknown) {
    await logError(`Gagal menghapus divisi dengan ID: ${id}`, err);
    return badRequest(c, 'Gagal menghapus divisi', {
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};
