import { Context } from 'hono';
import { ok, created, badRequest, notFound } from '../utils/response.helper';
import { logInfo, logWarn, logError } from '../utils/log.helper';
import PrsMasterKotService from '../services/prsMasterKotService';

// const service = new PrsMasterKotService();

export const getAllKota = async (c: Context): Promise<Response> => {
  try {
    await logInfo('Memulai ambil semua data kota');

    const data = await PrsMasterKotService.findAll();

    if (!data || data.length === 0) {
      await logWarn('Tidak ada data kota ditemukan', null);
      return notFound(c, 'Data kota tidak ditemukan');
    }

    await logInfo('Berhasil ambil semua data kota', null);
    return ok(c, data, 'Berhasil mengambil semua data kota');
  } catch (err: unknown) {
    await logError('Gagal ambil semua data kota', err);
    return badRequest(c, 'Gagal mengambil data kota', {
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};

export const getKotaById = async (c: Context): Promise<Response> => {
  const id = c.req.param('id');
  try {
    await logInfo(`Memulai ambil kota ID: ${id}`);

    const data = await PrsMasterKotService.findById(id);

    if (!data) {
      await logWarn(`Kota dengan ID ${id} tidak ditemukan`, null);
      return notFound(c, 'Data kota tidak ditemukan');
    }

    await logInfo(`Berhasil ambil kota ID: ${id}`, null);
    return ok(c, data, 'Berhasil mengambil data kota');
  } catch (err: unknown) {
    await logError(`Gagal ambil kota ID: ${id}`, err);
    return badRequest(c, 'Gagal mengambil data kota', {
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};
export const getKotaByIdProv = async (c: Context): Promise<Response> => {
  const prov_id = c.req.param('prov_id');

  try {
    await logInfo(`Memulai ambil kota berdasarkan ID Provinsi: ${prov_id}`);

    const data = await PrsMasterKotService.findByIdProv(prov_id);

    if (!data || data.length === 0) {
      await logWarn(`Tidak ada kota untuk ID Provinsi: ${prov_id}`, null);
      return notFound(c, 'Data kota untuk provinsi ini tidak ditemukan');
    }

    await logInfo(
      `Berhasil ambil data kota untuk ID Provinsi: ${prov_id}`,
      null
    );
    return ok(c, data, 'Berhasil mengambil data kota berdasarkan provinsi');
  } catch (err: unknown) {
    await logError(`Gagal ambil kota berdasarkan ID Provinsi: ${prov_id}`, err);
    return badRequest(c, 'Gagal mengambil data kota', {
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};
export const createKota = async (c: Context): Promise<Response> => {
  try {
    await logInfo('Memulai pembuatan kota baru');

    // Ambil body dan panggil service
    const body = await c.req.json();
    const data = await PrsMasterKotService.create(body);
    // const result = data.toJSON ? data.toJSON() : data;
    // Log sukses
    await logInfo(
      `Kota berhasil dibuat ID: ${data.id || 'tidak tersedia'}`,
      null
    );

    // Response Hono.js dengan status 201
    return created(c, data, 'Kota berhasil ditambahkan');
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';

    await logError('Gagal membuat kota', err);
    return badRequest(c, message);
  }
};

export const updateKota = async (c: Context): Promise<Response> => {
  const id = c.req.param('id');
  try {
    await logInfo(`Memulai update kota ID: ${id}`);

    const body = await c.req.json();
    const data = await PrsMasterKotService.update(id, body);

    if (!data) {
      await logWarn(`Kota dengan ID ${id} tidak ditemukan`, null);
      return notFound(c, 'Data kota tidak ditemukan');
    }

    await logInfo(`Kota ID ${id} berhasil diperbarui`, null);
    return ok(c, data, 'Data berhasil diperbarui');
  } catch (err: unknown) {
    await logError(`Gagal update kota ID: ${id}`, err);
    return badRequest(c, 'Gagal memperbarui data kota', {
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};

export const deleteKota = async (c: Context): Promise<Response> => {
  const id = c.req.param('id');
  try {
    await logInfo(`Memulai hapus kota ID: ${id}`);

    const data = await PrsMasterKotService.delete(id);

    if (!data) {
      await logWarn(`Kota dengan ID ${id} tidak ditemukan`, null);
      return notFound(c, 'Data kota tidak ditemukan');
    }

    await logInfo(`Kota ID ${id} berhasil dihapus`, null);
    return ok(c, data, 'Data berhasil dihapus');
  } catch (err: unknown) {
    await logError(`Gagal hapus kota ID: ${id}`, err);
    return badRequest(c, 'Gagal menghapus data kota', {
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};
