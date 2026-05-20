// src/controllers/prsMasterAgamaController.ts
import { Context } from 'hono';
import service from '../services/prsMasterAgamaService';
import { ok, created, badRequest, notFound } from '../utils/response.helper';
import { logInfo, logWarn, logError } from '../utils/log.helper';
import { PrsMasterAgamaDTO } from '../types/prsMasterAgamaDTO';

// DTO untuk request create/update agama
interface CreateAgamaDTO {
  agama: string;
}

export const getAll = async (c: Context): Promise<Response> => {
  try {
    await logInfo('Memulai ambil semua data agama');

    const data = await service.getAll();

    if (!data || data.length === 0) {
      await logWarn('Tidak ada data agama ditemukan', null);
      return ok(c, [], 'Tidak ada data agama ditemukan');
    }

    await logInfo('Berhasil ambil semua data agama', null);
    return ok(c, data, 'Berhasil mengambil semua agama');
  } catch (err: unknown) {
    await logError('Gagal ambil data agama', err);
    return badRequest(c, 'Gagal mengambil data agama', {
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};

export const getById = async (c: Context): Promise<Response> => {
  const kode_agama = parseInt(c.req.param('kode_agama'), 10);
  if (isNaN(kode_agama)) return badRequest(c, 'ID harus berupa angka');

  try {
    await logInfo(`Memulai ambil data agama ID: ${kode_agama}`);

    const data = await service.getById(kode_agama);

    if (!data) {
      await logWarn(`Agama dengan ID ${kode_agama} tidak ditemukan`, null);
      return notFound(c, 'Agama tidak ditemukan');
    }

    await logInfo(`Berhasil ambil data agama ID: ${kode_agama}`, null);
    return ok(c, data, 'Berhasil mengambil agama');
  } catch (err: unknown) {
    await logError(`Gagal ambil data agama ID: ${kode_agama}`, err);
    return badRequest(c, 'Gagal mengambil data agama', {
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};

export const create = async (c: Context): Promise<Response> => {
  try {
    await logInfo('Memulai pembuatan data agama baru');

    const body = (await c.req.json()) as CreateAgamaDTO;

    if (!body.agama) {
      return badRequest(c, 'Field "agama" wajib diisi');
    }
    // asdadadasd

    const data = await service.create(body);

    await logInfo('Data agama berhasil dibuat', null);
    return created(c, data, 'Data agama berhasil dibuat');
  } catch (err: unknown) {
    await logError('Gagal membuat data agama', err);
    return badRequest(c, 'Gagal menambahkan data agama', {
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};

export const update = async (c: Context): Promise<Response> => {
  const idParam = c.req.param('id');
  const id = parseInt(idParam, 10);

  if (isNaN(id)) {
    return badRequest(c, 'ID harus berupa angka');
  }

  try {
    await logInfo(`Memulai update data agama ID: ${id}`);

    // Ambil body dari request
    const body = (await c.req.json()) as PrsMasterAgamaDTO;

    // Validasi wajib: pastikan 'agama' ada
    if (!body.agama) {
      return badRequest(c, 'Field "agama" wajib diisi');
    }

    // Panggil service dengan data yang sudah pasti ada field 'agama'
    const data = await service.update(id, { agama: body.agama });

    await logInfo(`Data agama ID ${id} berhasil diperbarui`, null);
    return ok(c, data, 'Data agama berhasil diperbarui');
  } catch (err: unknown) {
    await logError(`Gagal update data agama ID: ${id}`, err);
    return badRequest(c, 'Gagal memperbarui data agama', {
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};

export const remove = async (c: Context): Promise<Response> => {
  const id = parseInt(c.req.param('id'), 10);
  if (isNaN(id)) return badRequest(c, 'ID harus berupa angka');

  try {
    await logInfo(`Memulai hapus data agama ID: ${id}`);

    const data = await service.delete(id);

    if (!data) {
      await logWarn(`Agama ID ${id} tidak ditemukan`, null);
      return notFound(c, 'Agama tidak ditemukan');
    }

    await logInfo(`Data agama ID ${id} berhasil dihapus`, null);
    return ok(c, data, 'Data agama berhasil dihapus');
  } catch (err: unknown) {
    await logError(`Gagal hapus data agama ID: ${id}`, err);
    return badRequest(c, 'Gagal menghapus data agama', {
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};

export default {
  getAll,
  getById,
  create,
  update,
  remove,
};
