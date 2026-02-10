import { Context } from 'hono';
import service from '../services/prsMasterDeputiService';
import { ok, created, badRequest, notFound } from '../utils/response.helper';
import { logInfo, logWarn, logError } from '../utils/log.helper';

export const getAll = async (c: Context) => {
  try {
    await logInfo('Memulai ambil semua data deputi');
    const data = await service.getAll();

    if (!data || data.length === 0) {
      await logWarn('Tidak ada data deputi ditemukan');
      return notFound(c, 'Data tidak ditemukan');
    }

    await logInfo('Berhasil ambil semua data deputi');
    return ok(c, data, 'Berhasil mengambil semua data deputi');
  } catch (err: unknown) {
    await logError('Gagal ambil semua data deputi', err);
    return badRequest(c, 'Gagal mengambil data deputi', {
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};

export const getById = async (c: Context) => {
  const id = c.req.param('id');
  try {
    await logInfo(`Memulai ambil data deputi ID: ${id}`);
    const data = await service.getById(id);

    if (!data) {
      await logWarn(`Data deputi ID ${id} tidak ditemukan`);
      return notFound(c, 'Data tidak ditemukan');
    }

    await logInfo(`Berhasil ambil data deputi ID: ${id}`);
    return ok(c, data, 'Berhasil mengambil data deputi');
  } catch (err: unknown) {
    await logError(`Gagal ambil data deputi ID: ${id}`, err);
    return badRequest(c, 'Gagal mengambil data deputi', {
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};

export const getByKode = async (c: Context) => {
  const kode = c.req.param('kode');
  try {
    await logInfo(`Memulai ambil data deputi berdasarkan kode: ${kode}`);
    const data = await service.getByKode(kode);

    if (!data) {
      await logWarn(`Data deputi dengan kode ${kode} tidak ditemukan`);
      return notFound(c, 'Data tidak ditemukan');
    }

    await logInfo(`Berhasil ambil data deputi dengan kode: ${kode}`);
    return ok(c, data, 'Berhasil mengambil data deputi');
  } catch (err: unknown) {
    await logError(`Gagal ambil data deputi berdasarkan kode: ${kode}`, err);
    return badRequest(c, 'Gagal mengambil data deputi', {
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};

export const create = async (c: Context) => {
  try {
    await logInfo('Memulai pembuatan data deputi baru');
    const body = await c.req.json();
    const data = await service.create(body);

    await logInfo('Data deputi berhasil dibuat');
    return created(c, data, 'Data deputi berhasil dibuat');
  } catch (err: unknown) {
    await logError('Gagal membuat data deputi', err);
    return badRequest(c, 'Gagal menambahkan data deputi', {
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};

export const update = async (c: Context) => {
  const id = c.req.param('id');
  try {
    await logInfo(`Memulai update data deputi ID: ${id}`);
    const body = await c.req.json();
    const data = await service.update(id, body);

    if (!data) {
      await logWarn(`Data deputi ID ${id} tidak ditemukan`);
      return notFound(c, 'Data tidak ditemukan');
    }

    await logInfo(`Data deputi ID ${id} berhasil diperbarui`);
    return ok(c, data, 'Data deputi berhasil diperbarui');
  } catch (err: unknown) {
    await logError(`Gagal update data deputi ID: ${id}`, err);
    return badRequest(c, 'Gagal memperbarui data deputi', {
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};

export const remove = async (c: Context) => {
  const id = c.req.param('id');
  try {
    await logInfo(`Memulai hapus data deputi ID: ${id}`);
    const data = await service.delete(id);

    if (!data) {
      await logWarn(`Data deputi ID ${id} tidak ditemukan`);
      return notFound(c, 'Data tidak ditemukan');
    }

    await logInfo(`Data deputi ID ${id} berhasil dihapus`);
    return ok(c, data, 'Data deputi berhasil dihapus');
  } catch (err: unknown) {
    await logError(`Gagal hapus data deputi ID: ${id}`, err);
    return badRequest(c, 'Gagal menghapus data deputi', {
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};
