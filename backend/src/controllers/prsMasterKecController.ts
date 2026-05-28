import { Context } from 'hono';
import { ok, created, badRequest, notFound } from '../utils/response.helper';
import { logInfo, logWarn, logError } from '../utils/log.helper';
import { PrsMasterKecService } from '../services/prsMasterKecService';
import { NotFoundException } from '../utils/http-exception';

const service = new PrsMasterKecService();

export const getAllKecamatan = async (c: Context) => {
  try {
    await logInfo('Memulai ambil semua data kecamatan');
    const data = await service.findAll();

    if (!data || data.length === 0) {
      await logWarn('Tidak ada data kecamatan ditemukan', undefined);
      return notFound(c, 'Data kecamatan tidak ditemukan');
    }

    await logInfo('Berhasil ambil semua data kecamatan', undefined);
    return ok(c, data, 'Berhasil mengambil semua data kecamatan');
  } catch (err: unknown) {
    await logError('Gagal ambil semua data kecamatan', err);
    return badRequest(c, 'Gagal mengambil data kecamatan', {
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};

export const getKecamatanById = async (c: Context) => {
  const id = c.req.param('id');
  try {
    await logInfo(`Memulai ambil kecamatan ID: ${id}`);
    const data = await service.findById(id);

    if (!data) {
      await logWarn(`Kecamatan dengan ID ${id} tidak ditemukan`, undefined);
      return notFound(c, 'Data kecamatan tidak ditemukan');
    }

    await logInfo(`Berhasil ambil kecamatan ID: ${id}`, undefined);
    return ok(c, data, 'Berhasil mengambil data kecamatan');
  } catch (err: unknown) {
    await logError(`Gagal ambil kecamatan ID: ${id}`, err);
    return badRequest(c, 'Gagal mengambil data kecamatan', {
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};

export const getKecamatanByKotId = async (c: Context) => {
  const kot_id = c.req.param('kot_id'); // pastikan param di route: /kecamatan/kota/:kot_id
  try {
    await logInfo(`Memulai ambil kecamatan berdasarkan kot_id: ${kot_id}`);

    const data = await service.findByKotId(kot_id);

    await logInfo(
      `Berhasil ambil kecamatan berdasarkan kot_id: ${kot_id}`,
      undefined
    );
    return ok(c, data, 'Berhasil mengambil data kecamatan berdasarkan kota');
  } catch (err: unknown) {
    if (err instanceof NotFoundException) {
      await logWarn(
        `Kecamatan untuk kot_id ${kot_id} tidak ditemukan`,
        undefined
      );
      return notFound(c, err.message);
    }
    await logError(`Gagal ambil kecamatan berdasarkan kot_id: ${kot_id}`, err);
    return badRequest(c, 'Gagal mengambil data kecamatan', {
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};

export const createKecamatan = async (c: Context) => {
  try {
    await logInfo('Memulai pembuatan kecamatan baru');
    const body = await c.req.json();
    const data = await service.create(body);

    await logInfo('Kecamatan berhasil dibuat', undefined);
    return created(c, data, 'Kecamatan berhasil ditambahkan');
  } catch (err: unknown) {
    await logError('Gagal membuat kecamatan', err);
    return badRequest(c, 'Gagal menambahkan kecamatan', {
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};

export const updateKecamatan = async (c: Context) => {
  const id = c.req.param('id');
  try {
    await logInfo(`Memulai update kecamatan ID: ${id}`);
    const body = await c.req.json();
    const data = await service.update(id, body);

    if (!data) {
      await logWarn(`Kecamatan dengan ID ${id} tidak ditemukan`, undefined);
      return notFound(c, 'Data kecamatan tidak ditemukan');
    }

    await logInfo(`Kecamatan ID ${id} berhasil diperbarui`, undefined);
    return ok(c, data, 'Data berhasil diperbarui');
  } catch (err: unknown) {
    await logError(`Gagal update kecamatan ID: ${id}`, err);
    return badRequest(c, 'Gagal memperbarui data kecamatan', {
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};

export const deleteKecamatan = async (c: Context) => {
  const id = c.req.param('id');
  try {
    await logInfo(`Memulai hapus kecamatan ID: ${id}`);
    const data = await service.delete(id);

    if (!data) {
      await logWarn(`Kecamatan dengan ID ${id} tidak ditemukan`, undefined);
      return notFound(c, 'Data kecamatan tidak ditemukan');
    }

    await logInfo(`Kecamatan ID ${id} berhasil dihapus`, undefined);
    return ok(c, data, 'Data berhasil dihapus');
  } catch (err: unknown) {
    await logError(`Gagal hapus kecamatan ID: ${id}`, err);
    return badRequest(c, 'Gagal menghapus data kecamatan', {
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};
