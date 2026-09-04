import { Context } from 'hono';
import PrsJamMengajarServices from '../services/jamMengajarService';

import { ok, created, badRequest, notFound } from '../utils/response.helper';
import { logInfo, logWarn, logError } from '../utils/log.helper';

const service = new PrsJamMengajarServices();
export const getAll = async (c: Context): Promise<Response> => {
  try {
    const data = await service.getAll();

    if (!data || data.length === 0) {
      await logWarn('Tidak ada data ditemukan', null);
      return notFound(c, 'Tidak ada data ditemukan');
    }

    await logInfo('Berhasil ambil semua data', null);
    return ok(c, data, 'Berhasil mengambil semua data');
  } catch (err: unknown) {
    await logError('Gagal ambil semua data', err);
    return badRequest(c, 'Gagal mengambil data', {
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};

export const getById = async (c: Context): Promise<Response> => {
  const id = c.req.param('id');
  try {
    await logInfo(`Memulai ambil data ID: ${id}`);

    const data = await service.getById(id);

    if (!data) {
      await logWarn(`Data dengan ID ${id} tidak ditemukan`, null);
      return notFound(c, 'Data tidak ditemukan');
    }

    await logInfo(`Berhasil ambil data ID: ${id}`, null);
    return ok(c, data, 'Berhasil mengambil data');
  } catch (err: unknown) {
    await logError(`Gagal ambil data ID: ${id}`, err);
    return badRequest(c, 'Gagal mengambil data', {
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};

export const create = async (c: Context): Promise<Response> => {
  try {
    await logInfo('Memulai pembuatan data baru');

    const body = await c.req.json();
    // console.log(body);
    const data = await service.create(body);

    await logInfo('Data berhasil dibuat', null);
    return created(c, data, 'Data berhasil ditambahkan');
  } catch (err: unknown) {
    await logError('Gagal membuat data', err);
    return badRequest(c, 'Gagal menambahkan data', {
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};

export const updateJamMengajar = async (c: Context): Promise<Response> => {
  const id = c.req.param('id');
  try {
    await logInfo(`Memulai update data ID: ${id}`);

    const body = await c.req.json();
    const data = await service.update(id, body);

    await logInfo(`Data ID: ${id} berhasil diperbarui`, null);
    return ok(c, data, 'Data berhasil diperbarui');
  } catch (err: unknown) {
    await logError(`Gagal update data ID: ${id}`, err);
    return badRequest(c, 'Gagal memperbarui data', {
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};

export const remove = async (c: Context): Promise<Response> => {
  const id = c.req.param('id');
  try {
    await logInfo(`Memulai hapus data ID: ${id}`);

    await service.delete(id);

    await logInfo(`Data ID: ${id} berhasil dihapus`, null);
    return ok(c, null, 'Data berhasil dihapus');
  } catch (err: unknown) {
    await logError(`Gagal hapus data ID: ${id}`, err);
    return badRequest(c, 'Gagal menghapus data', {
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};

export const getByKaryawanId = async (c: Context): Promise<Response> => {
  const id_karyawan = c.req.param('id_karyawan');

  try {
    await logInfo(
      `🔍 Memulai ambil data jam mengajar untuk ID karyawan: ${id_karyawan}`
    );

    const data = await service.getJamMengajarByIdKaryawan(id_karyawan);

    await logInfo(
      `✅ Berhasil ambil data jam mengajar untuk ID karyawan: ${id_karyawan}`
    );
    return ok(c, data, 'Berhasil mengambil data jam mengajar');
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    await logError(
      `❌ Gagal ambil data jam mengajar untuk ID karyawan: ${id_karyawan}`,
      err
    );

    if (message.includes('tidak ditemukan')) {
      return notFound(c, message);
    }

    return badRequest(c, 'Gagal mengambil data jam mengajar', { message });
  }
};
export const updateJamMengajarByIdKaryawanAndUkkId = async (c: Context) => {
  const id_karyawan = c.req.param('id_karyawan');
  const ukk_id = c.req.param('ukk_id');

  if (!id_karyawan) {
    return badRequest(c, 'Parameter id_karyawan wajib disertakan.');
  }

  if (!ukk_id) {
    return badRequest(c, 'Parameter ukk_id wajib disertakan.');
  }

  const body = (await c.req.json()) as { jam_mengajar?: unknown };

  if (body.jam_mengajar !== undefined) {
    const jamMengajarNumber = Number(body.jam_mengajar);
    if (isNaN(jamMengajarNumber)) {
      return badRequest(c, 'Field jam_mengajar harus berupa angka.');
    }
    body.jam_mengajar = jamMengajarNumber;
  }

  const result = await service.updateByIdKaryawanAndUkkId(
    id_karyawan,
    ukk_id,
    body
  );

  if (!result) {
    return notFound(c, 'Data jam mengajar tidak ditemukan');
  }

  return ok(c, result, 'Berhasil memperbarui data jam mengajar.');
};

export default {
  getAll,
  getById,
  create,
  updateJamMengajar,
  remove,
  getByKaryawanId,
  updateJamMengajarByIdKaryawanAndUkkId,
};
