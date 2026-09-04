import { Context } from 'hono';
import { ok, created, badRequest, notFound } from '../utils/response.helper';
import { logInfo, logWarn, logError } from '../utils/log.helper';
import { PrsRiwPendidikanKarService } from '../services/prsRiwPendidikanKarService';

const service = new PrsRiwPendidikanKarService();

export const getAllRiwPendidikanKar = async (c: Context) => {
  try {
    await logInfo('Memulai ambil semua data riwayat pendidikan karyawan');
    const data = await service.findAll();

    if (!data || data.length === 0) {
      await logWarn('Tidak ada data riwayat pendidikan karyawan', null);
      return notFound(c, 'Tidak ada data ditemukan');
    }

    await logInfo(
      'Berhasil ambil semua data riwayat pendidikan karyawan',
      null
    );
    return ok(c, data, 'Berhasil mengambil data riwayat pendidikan karyawan');
  } catch (err: unknown) {
    await logError('Gagal ambil semua data riwayat pendidikan karyawan', err);
    return badRequest(c, 'Gagal mengambil data', {
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};

export const getRiwPendidikanKarById = async (c: Context) => {
  const id = c.req.param('id');
  try {
    await logInfo(`Memulai ambil data riwayat pendidikan karyawan ID: ${id}`);
    const data = await service.findById(id);

    await logInfo(
      `Berhasil ambil data riwayat pendidikan karyawan ID: ${id}`,
      null
    );
    return ok(c, data, 'Berhasil mengambil data riwayat pendidikan karyawan');
  } catch (err: unknown) {
    if (err instanceof Error && err.message === 'Data tidak ditemukan') {
      await logWarn(
        `Data riwayat pendidikan karyawan ID ${id} tidak ditemukan`,
        null
      );
      return notFound(c, 'Data tidak ditemukan');
    }
    await logError(
      `Gagal ambil data riwayat pendidikan karyawan ID: ${id}`,
      err
    );
    return badRequest(c, 'Gagal mengambil data', {
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};

export const createRiwPendidikanKar = async (c: Context) => {
  try {
    await logInfo('Memulai pembuatan data riwayat pendidikan karyawan baru');
    const body = await c.req.json();
    const createdData = await service.create(body); // ganti nama variabel

    await logInfo(
      `Data riwayat pendidikan karyawan berhasil dibuat ID: ${createdData.rpk_id}`,
      null
    );

    return created(
      c,
      createdData,
      'Data riwayat pendidikan karyawan berhasil dibuat'
    ); // panggil helper
  } catch (err: unknown) {
    await logError('Gagal membuat data riwayat pendidikan karyawan', err);
    return badRequest(c, 'Gagal membuat data', {
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};

export const updateRiwPendidikanKar = async (c: Context) => {
  const id = c.req.param('id');
  try {
    await logInfo(`Memulai update data riwayat pendidikan karyawan ID: ${id}`);
    const body = await c.req.json();
    const updated = await service.update(id, body);

    await logInfo(
      `Data riwayat pendidikan karyawan berhasil diperbarui ID: ${id}`,
      null
    );
    return ok(
      c,
      updated,
      'Data riwayat pendidikan karyawan berhasil diperbarui'
    );
  } catch (err: unknown) {
    await logError(
      `Gagal update data riwayat pendidikan karyawan ID: ${id}`,
      err
    );
    return badRequest(c, 'Gagal memperbarui data', {
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};

export const deleteRiwPendidikanKar = async (c: Context) => {
  const id = c.req.param('id');
  try {
    await logInfo(`Memulai hapus data riwayat pendidikan karyawan ID: ${id}`);
    const deleted = await service.delete(id);

    await logInfo(
      `Data riwayat pendidikan karyawan berhasil dihapus ID: ${id}`,
      null
    );
    return ok(
      c,
      { deleted },
      'Data riwayat pendidikan karyawan berhasil dihapus'
    );
  } catch (err: unknown) {
    await logError(
      `Gagal hapus data riwayat pendidikan karyawan ID: ${id}`,
      err
    );
    return badRequest(c, 'Gagal menghapus data', {
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};
export const updateRiwPendidikanKardetail = async (c: Context) => {
  const karyawan_id = c.req.param('karyawan_id');
  const rpk_id = c.req.param('rpk_id');

  if (!karyawan_id || !rpk_id) {
    return badRequest(c, 'Parameter "karyawan_id" dan "rpk_id" wajib diisi');
  }

  const body = (await c.req.json()) as Record<string, unknown>;

  const result = await service.updatePendidikan(karyawan_id, rpk_id, body);

  // ❌ jangan cek result.success (tidak ada)
  if (!result) {
    return badRequest(c, 'Gagal memperbarui data pendidikan');
  }

  return ok(c, result, result.message ?? 'Data pendidikan berhasil diperbarui');
};

export default {
  getAllRiwPendidikanKar,
  getRiwPendidikanKarById,
  createRiwPendidikanKar,
  updateRiwPendidikanKar,
  deleteRiwPendidikanKar,
  updateRiwPendidikanKardetail,
};
