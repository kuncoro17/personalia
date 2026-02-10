// controllers/prsStatusKaryawanController.ts
import { Context } from 'hono';
import { PrsStatusKaryawanService } from '../services/prsStatusKaryawanService';
import { ok, created, badRequest, notFound } from '../utils/response.helper';
import { logInfo, logWarn, logError } from '../utils/log.helper';
import { PrsStatusKaryawanCreateInput } from '../types/prsStatusKaryawan.types';

const service = new PrsStatusKaryawanService();

export const getAllStatusKaryawan = async (c: Context) => {
  try {
    await logInfo('Memulai ambil semua data Status Karyawan');
    const data = await service.getAll();

    await logInfo('Berhasil ambil semua data Status Karyawan', null);
    return ok(c, data, 'Berhasil mengambil semua Status Karyawan');
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    await logError('Gagal ambil semua data Status Karyawan', message);
    return badRequest(c, 'Gagal mengambil data Status Karyawan', { message });
  }
};

export const getStatusKaryawanById = async (c: Context) => {
  const id = c.req.param('id');
  try {
    await logInfo(`Memulai ambil Status Karyawan ID: ${id}`);
    const data = await service.getById(id);

    if (!data) {
      await logWarn(`Status Karyawan dengan ID ${id} tidak ditemukan`, null);
      return notFound(c, 'Status Karyawan tidak ditemukan');
    }

    await logInfo(`Berhasil ambil Status Karyawan ID: ${id}`, null);
    return ok(c, data, 'Berhasil mengambil Status Karyawan');
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    await logError(`Gagal ambil Status Karyawan ID: ${id}`, message);
    return badRequest(c, 'Gagal mengambil Status Karyawan', { message });
  }
};
function isSequelizeModel<T>(obj: unknown): obj is { toJSON: () => T } {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'toJSON' in obj &&
    typeof (obj as { toJSON?: unknown }).toJSON === 'function'
  );
}
export const createStatusKaryawan = async (c: Context) => {
  try {
    await logInfo('Memulai pembuatan Status Karyawan baru');
    const body = (await c.req.json()) as PrsStatusKaryawanCreateInput;
    const createdData = await service.create(body);

    const plain = isSequelizeModel<PrsStatusKaryawanCreateInput>(createdData)
      ? createdData.toJSON()
      : createdData;

    await logInfo(
      `Status Karyawan berhasil dibuat ID: ${plain.stat_id || 'tidak tersedia'}`,
      null
    );
    return created(c, plain, 'Status Karyawan berhasil dibuat');
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    await logError('Gagal membuat Status Karyawan', message);
    return badRequest(c, 'Gagal membuat Status Karyawan', { message });
  }
};

export const updateStatusKaryawan = async (c: Context) => {
  const id = c.req.param('id');
  try {
    await logInfo(`Memulai update Status Karyawan ID: ${id}`);
    const body = (await c.req.json()) as Partial<PrsStatusKaryawanCreateInput>;
    const updated = await service.update(id, body);

    await logInfo(`Status Karyawan berhasil diperbarui ID: ${id}`, null);
    return ok(c, updated, 'Status Karyawan berhasil diperbarui');
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    await logError(`Gagal update Status Karyawan ID: ${id}`, message);
    return badRequest(c, 'Gagal memperbarui Status Karyawan', { message });
  }
};

export const deleteStatusKaryawan = async (c: Context) => {
  const id = c.req.param('id');
  try {
    await logInfo(`Memulai hapus Status Karyawan ID: ${id}`);
    await service.delete(id);

    await logInfo(`Status Karyawan berhasil dihapus ID: ${id}`, null);
    return ok(c, { message: 'Status Karyawan berhasil dihapus' });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    await logError(`Gagal hapus Status Karyawan ID: ${id}`, message);
    return badRequest(c, 'Gagal menghapus Status Karyawan', { message });
  }
};
