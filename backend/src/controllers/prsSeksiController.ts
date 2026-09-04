import { Context } from 'hono';
import service from '../services/prsSeksiService';
import { ok, created, badRequest, notFound } from '../utils/response.helper';
import { logInfo, logWarn, logError } from '../utils/log.helper';

export const getAll = async (c: Context) => {
  try {
    await logInfo('Memulai ambil semua data seksi');
    const data = await service.getAll();

    await logInfo('Berhasil ambil semua data seksi', null);
    return ok(c, data, 'Berhasil mengambil semua seksi');
  } catch (err: unknown) {
    await logError('Gagal ambil semua data seksi', err);
    return badRequest(c, 'Gagal mengambil data seksi', {
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};

export const getById = async (c: Context) => {
  const id = c.req.param('id');
  try {
    await logInfo(`Memulai ambil data seksi ID: ${id}`);
    const data = await service.getById(id);

    if (!data) {
      await logWarn(`Data seksi dengan ID ${id} tidak ditemukan`, null);
      return notFound(c, 'Data seksi tidak ditemukan');
    }

    await logInfo(`Berhasil ambil data seksi ID: ${id}`, null);
    return ok(c, data, 'Berhasil mengambil data seksi');
  } catch (err: unknown) {
    await logError(`Gagal ambil data seksi ID: ${id}`, err);
    return badRequest(c, 'Gagal mengambil data seksi', {
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};

export const create = async (c: Context) => {
  try {
    await logInfo('Memulai pembuatan seksi baru');
    const body = await c.req.json();
    const createdData = await service.create(body);

    await logInfo(`Seksi berhasil dibuat ID: ${createdData.sek_id}`, null);
    return created(c, createdData, 'Seksi berhasil dibuat');
  } catch (err: unknown) {
    await logError('Gagal membuat seksi', err);
    return badRequest(c, 'Gagal membuat seksi', {
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};

export const update = async (c: Context) => {
  const id = c.req.param('id');
  try {
    await logInfo(`Memulai update seksi ID: ${id}`);
    const body = await c.req.json();
    const updated = await service.update(id, body);

    await logInfo(`Seksi berhasil diperbarui ID: ${id}`, null);
    return ok(c, updated, 'Seksi berhasil diperbarui');
  } catch (err: unknown) {
    await logError(`Gagal update seksi ID: ${id}`, err);
    return badRequest(c, 'Gagal memperbarui seksi', {
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};

export const remove = async (c: Context) => {
  const id = c.req.param('id');
  try {
    await logInfo(`Memulai hapus seksi ID: ${id}`);
    await service.delete(id);

    await logInfo(`Seksi berhasil dihapus ID: ${id}`, null);
    return ok(c, { message: 'Seksi berhasil dihapus' });
  } catch (err: unknown) {
    await logError(`Gagal hapus seksi ID: ${id}`, err);
    return badRequest(c, 'Gagal menghapus seksi', {
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};

export const getByKodeBagian = async (c: Context) => {
  const kode_bagian = c.req.param('kode_bagian');

  if (!kode_bagian || kode_bagian.trim() === '') {
    return badRequest(c, 'kode_bagian harus diisi');
  }

  try {
    await logInfo(
      `📘 Mulai mengambil seksi berdasarkan kode_bagian: ${kode_bagian}`
    );

    const data = await service.getSeksiByKodeBagian(kode_bagian.trim());

    if (!data || (Array.isArray(data) && data.length === 0)) {
      await logError(
        `⚠️ Seksi tidak ditemukan untuk kode_bagian: ${kode_bagian}`
      );
      return badRequest(c, 'Seksi tidak ditemukan');
    }

    // 🔄 Flatten hasil data (ambil nama kolom terakhir)
    const flattenedData = data.map((plainData: Record<string, any>) => {
      const result: Record<string, any> = {};

      Object.entries(plainData).forEach(([key, value]) => {
        const parts = key.split('.');
        const finalKey = parts[parts.length - 1]; // ambil key paling akhir
        result[finalKey] = value;
      });

      return result;
    });

    await logInfo(
      `✅ Berhasil mengambil seksi untuk kode_bagian: ${kode_bagian}`
    );
    return ok(c, { data: flattenedData });
  } catch (err: unknown) {
    await logError(
      `❌ Gagal mengambil seksi untuk kode_bagian: ${kode_bagian}`,
      err
    );
    const message = err instanceof Error ? err.message : 'Unknown error';
    return badRequest(c, 'Gagal mengambil data seksi', { message });
  }
};

export default {
  getAll,
  getById,
  create,
  update,
  remove,
  getByKodeBagian,
};
