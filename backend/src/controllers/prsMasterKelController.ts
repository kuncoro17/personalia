import { Context } from 'hono';
import { ok, created, badRequest, notFound } from '../utils/response.helper';
import { logInfo, logWarn, logError } from '../utils/log.helper';
import { PrsMasterKelService } from '../services/prsMasterKelService';

const service = new PrsMasterKelService();

export const getAllKelurahan = async (c: Context) => {
  try {
    await logInfo('Memulai ambil semua data kelurahan');

    // Panggil service untuk ambil data
    const data = await service.findAll();

    // Jika data kosong
    if (!data || data.length === 0) {
      await logWarn('Tidak ada data kelurahan ditemukan', null);
      return notFound(c, 'Data kelurahan tidak ditemukan');
    }

    await logInfo('Berhasil ambil semua data kelurahan', null);

    // Kembalikan response sukses
    return ok(c, data, 'Berhasil mengambil semua data kelurahan');
  } catch (err: unknown) {
    await logError('Gagal ambil semua data kelurahan', err);
    return badRequest(c, 'Gagal mengambil data kelurahan', {
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};

export const getKelurahanById = async (c: Context): Promise<Response> => {
  const id = c.req.param('id');
  try {
    await logInfo(`Memulai ambil kelurahan ID: ${id}`);

    const data = await service.findById(id);

    if (!data) {
      await logWarn(`Kelurahan dengan ID ${id} tidak ditemukan`, null);
      return notFound(c, 'Data kelurahan tidak ditemukan');
    }

    await logInfo(`Berhasil ambil kelurahan ID: ${id}`, null);
    return ok(c, data, 'Berhasil mengambil data kelurahan');
  } catch (err: unknown) {
    await logError(`Gagal ambil kelurahan ID: ${id}`, err);
    return badRequest(c, 'Gagal mengambil data kelurahan', {
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};
export const getKelurahanByKecId = async (c: Context): Promise<Response> => {
  const kec_id = c.req.param('kec_id');

  try {
    await logInfo(`Memulai ambil kelurahan berdasarkan kec_id: ${kec_id}`);

    const data = await service.findByKecId(kec_id);

    await logInfo(
      `Berhasil ambil kelurahan berdasarkan kec_id: ${kec_id}`,
      null
    );
    return ok(
      c,
      data,
      'Berhasil mengambil data kelurahan berdasarkan kecamatan'
    );
  } catch (err: unknown) {
    await logError(`Gagal ambil kelurahan berdasarkan kec_id: ${kec_id}`, err);
    return badRequest(c, 'Gagal mengambil data kelurahan', {
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};

export const createKelurahan = async (c: Context): Promise<Response> => {
  try {
    await logInfo('Memulai pembuatan kelurahan baru');

    const body = await c.req.json();
    const data = await service.create(body);

    await logInfo('Kelurahan berhasil dibuat', null);
    return created(c, data, 'Kelurahan berhasil ditambahkan');
  } catch (err: unknown) {
    await logError('Gagal membuat kelurahan', err);
    return badRequest(c, 'Gagal menambahkan kelurahan', {
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};

export const updateKelurahan = async (c: Context): Promise<Response> => {
  const id = c.req.param('id');
  try {
    await logInfo(`Memulai update kelurahan ID: ${id}`);

    const body = await c.req.json();
    const data = await service.update(id, body);

    if (!data) {
      await logWarn(`Kelurahan dengan ID ${id} tidak ditemukan`, null);
      return notFound(c, 'Data kelurahan tidak ditemukan');
    }

    await logInfo(`Kelurahan ID ${id} berhasil diperbarui`, null);
    return ok(c, data, 'Data berhasil diperbarui');
  } catch (err: unknown) {
    await logError(`Gagal update kelurahan ID: ${id}`, err);
    return badRequest(c, 'Gagal memperbarui data kelurahan', {
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};

export const deleteKelurahan = async (c: Context): Promise<Response> => {
  const id = c.req.param('id');
  try {
    await logInfo(`Memulai hapus kelurahan ID: ${id}`);

    const data = await service.delete(id);

    if (!data) {
      await logWarn(`Kelurahan dengan ID ${id} tidak ditemukan`, null);
      return notFound(c, 'Data kelurahan tidak ditemukan');
    }

    await logInfo(`Kelurahan ID ${id} berhasil dihapus`, null);
    return ok(c, data, 'Data berhasil dihapus');
  } catch (err: unknown) {
    await logError(`Gagal hapus kelurahan ID: ${id}`, err);
    return badRequest(c, 'Gagal menghapus data kelurahan', {
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};
