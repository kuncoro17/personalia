import { Context } from 'hono';

import { ok, created, badRequest, notFound } from '../utils/response.helper';
import { logInfo, logWarn, logError } from '../utils/log.helper';
import { PrsUnitKerjaCreateInput } from '../types/prsUnitKerja.types';
import { PrsUnitKerjaService } from '../services/prsUnitKerjaService';

const service = new PrsUnitKerjaService();

export const getAll = async (c: Context) => {
  try {
    await logInfo('Memulai ambil semua data');
    const data = await service.getAll();

    await logInfo('Berhasil ambil semua data', null);
    return ok(c, data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';

    await logError('Gagal ambil semua data', err);
    return badRequest(c, message);
  }
};
export const getAllUnitKerja1 = async (c: Context) => {
  try {
    const data = await service.getAllUnitKerja1();
    return ok(c, data, 'Berhasil mengambil semua data unit kerja');
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : 'Gagal ambil semua data unit kerja';

    return badRequest(c, message);
  }
};

export const getById = async (c: Context) => {
  const id = c.req.param('id');
  try {
    await logInfo(`Memulai ambil data ID: ${id}`);
    const data = await service.getById(id);

    if (!data) {
      await logWarn(`Data dengan ID ${id} tidak ditemukan`, null);
      return notFound(c, 'Data tidak ditemukan');
    }

    await logInfo(`Berhasil ambil data ID: ${id}`, null);
    return ok(c, data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';

    await logError(`Gagal ambil data ID: ${id}`, err);
    return badRequest(c, message);
  }
};

export const createUnitKerja = async (c: Context) => {
  try {
    await logInfo('Memulai pembuatan unit kerja baru');

    const body = (await c.req.json()) as PrsUnitKerjaCreateInput;

    const createdInstance = await service.create(body);

    await logInfo(
      `Unit kerja berhasil dibuat ID: ${createdInstance.uk_id || 'tidak tersedia'}`,
      null
    );

    return created(c, createdInstance, 'Unit kerja berhasil dibuat');
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    await logError('Gagal membuat unit kerja', err);
    return badRequest(c, message);
  }
};

export const update = async (c: Context) => {
  const id = c.req.param('id');
  try {
    await logInfo(`Memulai update data ID: ${id}`);
    const body = await c.req.json<Record<string, unknown>>();
    const updated = await service.update(id, body);

    await logInfo(`Data berhasil diperbarui ID: ${id}`, null);
    return ok(c, updated, 'Data berhasil diperbarui');
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';

    await logError(`Gagal update data ID: ${id}`, err);
    return badRequest(c, message);
  }
};

export const remove = async (c: Context) => {
  const id = c.req.param('id');
  try {
    await logInfo(`Memulai hapus data ID: ${id}`);
    await service.delete(id);

    await logInfo(`Data berhasil dihapus ID: ${id}`, null);
    return ok(c, { message: 'Deleted' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';

    await logError(`Gagal hapus data ID: ${id}`, err);
    return badRequest(c, message);
  }
};
type UnitKerjaRecord = {
  kode_seksi?: string;
  seksi?: Record<string, unknown>;
  kode_bagian?: string;
  bagian?: Record<string, unknown>;
  kode_divisi?: string;
  divisi?: Record<string, unknown>;
  kode_deputi?: string;
  deputi?: Record<string, unknown>;
  kode_direktur?: string;
  direktur?: Record<string, unknown>;
};

export const getJoinedUnitKerja = async (c: Context) => {
  const service = new PrsUnitKerjaService();

  try {
    logInfo('Request getJoinedUnitKerja diterima');

    const result = await service.findJoinedUnitKerja();

    if (!result || (Array.isArray(result) && result.length === 0)) {
      return notFound(c, 'Data Unit Kerja tidak ditemukan');
    }

    // ✅ Normalisasi hasil (baik dari Sequelize instance maupun plain object)
    const normalizeToPlain = (item: unknown): UnitKerjaRecord => {
      if (
        item &&
        typeof item === 'object' &&
        'toJSON' in item &&
        typeof (item as { toJSON: () => unknown }).toJSON === 'function'
      ) {
        return (item as { toJSON: () => UnitKerjaRecord }).toJSON();
      }
      return item as UnitKerjaRecord;
    };

    const plainData: UnitKerjaRecord[] = Array.isArray(result)
      ? result.map(normalizeToPlain)
      : [normalizeToPlain(result)];

    // ✅ Mapping hasil berdasarkan level organisasi
    const mappedResult = plainData.map(item => {
      if (item.kode_seksi && item.kode_seksi !== 'nnn') return item.seksi ?? {};
      if (item.kode_bagian && item.kode_bagian !== 'nnn')
        return item.bagian ?? {};
      if (item.kode_divisi && item.kode_divisi !== 'nnn')
        return item.divisi ?? {};
      if (item.kode_deputi && item.kode_deputi !== 'nnn')
        return item.deputi ?? {};
      if (item.kode_direktur && item.kode_direktur !== 'nnn')
        return item.direktur ?? {};
      return {};
    });

    return ok(c, mappedResult, 'Berhasil ambil data Unit Kerja (join)');
  } catch (err: unknown) {
    logError('Gagal ambil data Unit Kerja (controller)', err);

    if (err instanceof Error && 'status' in err) {
      const e = err as Error & { status?: number };
      if (e.status === 404) return notFound(c, e.message);
      if (e.status === 400) return badRequest(c, e.message);
    }

    const message =
      err instanceof Error ? err.message : 'Terjadi kesalahan tidak terduga';
    return badRequest(c, message);
  }
};
