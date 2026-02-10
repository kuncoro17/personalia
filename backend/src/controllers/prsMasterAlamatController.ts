import { Context } from 'hono';
import service from '../services/prsMasterAlamatService';
import { PrsKaryawanService } from '../services/PrsKaryawan.service';

import { ok, created, badRequest, notFound } from '../utils/response.helper';
import { logInfo, logWarn, logError } from '../utils/log.helper';
// import PrsKaryawanAlamatDTO from '../types/PrsKaryawanAlamatDTO';

export const getAll = async (c: Context) => {
  try {
    await logInfo('Memulai ambil semua data');
    const data = await service.getAll();

    if (!data || data.length === 0) {
      await logWarn('Tidak ada data ditemukan', undefined);
      return notFound(c, 'Data tidak ditemukan');
    }

    await logInfo('Berhasil ambil semua data', undefined);
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

    if (!data) {
      await logWarn(`Data ID ${id} tidak ditemukan`, undefined);
      return notFound(c, 'Data tidak ditemukan');
    }

    await logInfo(`Berhasil ambil data ID: ${id}`, undefined);
    return ok(c, data, 'Berhasil mengambil data');
  } catch (err: unknown) {
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
    const data = await service.create(body);

    await logInfo('Data berhasil dibuat', undefined);
    return created(c, data, 'Data berhasil dibuat');
  } catch (err: unknown) {
    await logError('Gagal membuat data', err);
    return badRequest(c, 'Gagal menambahkan data', {
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};

export const update = async (c: Context) => {
  const id = c.req.param('id');
  try {
    await logInfo(`Memulai update data ID: ${id}`);
    const body = await c.req.json();
    const data = await service.update(id, body);

    if (!data) {
      await logWarn(`Data ID ${id} tidak ditemukan`, undefined);
      return notFound(c, 'Data tidak ditemukan');
    }

    await logInfo(`Data ID ${id} berhasil diperbarui`, undefined);
    return ok(c, data, 'Data berhasil diperbarui');
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
    const data = await service.delete(id);

    if (!data) {
      await logWarn(`Data ID ${id} tidak ditemukan`, undefined);
      return notFound(c, 'Data tidak ditemukan');
    }

    await logInfo(`Data ID ${id} berhasil dihapus`, undefined);
    return ok(c, data, 'Data berhasil dihapus');
  } catch (err: unknown) {
    await logError(`Gagal hapus data ID: ${id}`, err);
    return badRequest(c, 'Gagal menghapus data', {
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};
export const createAlamatKaryawan = async (c: Context) => {
  const services = new PrsKaryawanService();

  const idKaryawan = c.req.param('id_karyawan');

  if (!idKaryawan) {
    return badRequest(c, 'Parameter "id_karyawan" diperlukan');
  }

  const body = await c.req.json();

  // 🔥 Repo sudah CREATE + UPDATE karyawan
  await service.createAlamatByKaryawanId(idKaryawan, body);
  if (!created) {
    return badRequest(c, 'Gagal menambahkan alamat karyawan');
  }
  // 🔥 Ambil ulang data lengkap
  const data = await services.getAlamatLengkapByIdKaryawan(idKaryawan);

  return ok(c, data, 'Alamat karyawan berhasil ditambahkan');
};
