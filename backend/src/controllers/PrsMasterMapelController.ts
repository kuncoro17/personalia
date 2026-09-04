import { Context } from 'hono';
import { ok, created, badRequest, notFound } from '../utils/response.helper';
import { logInfo, logWarn, logError } from '../utils/log.helper';
import service from '../services/prsMapelService';
import {
  CreateMapelSchema,
  UpdateMapelSchema,
  CreateMapelDTO,
  UpdateMapelDTO,
} from '../types/mapel.dto';

// Helper untuk ambil error.message dengan aman
function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return String(err);
}

export const getAllMapel = async (c: Context): Promise<Response> => {
  try {
    await logInfo('Memulai ambil semua data mapel');

    const data = await service.getAll();

    if (!data || data.length === 0) {
      await logWarn('Tidak ada data mapel ditemukan', null);
      return notFound(c, 'Data mapel tidak ditemukan');
    }

    await logInfo('Berhasil ambil semua data mapel', null);
    return ok(c, data, 'Berhasil mengambil semua data mapel');
  } catch (err: unknown) {
    await logError('Gagal ambil semua data mapel', err);
    return badRequest(c, 'Gagal mengambil data mapel', {
      message: getErrorMessage(err),
    });
  }
};

export const getMapelById = async (c: Context): Promise<Response> => {
  const id = c.req.param('id');
  try {
    await logInfo(`Memulai ambil mapel ID: ${id}`);

    const data = await service.getById(id);

    await logInfo(`Berhasil ambil mapel ID: ${id}`, null);
    return ok(c, data, 'Berhasil ambil data mapel');
  } catch (err: unknown) {
    await logError(`Gagal ambil mapel ID: ${id}`, err);
    return badRequest(c, 'Gagal mengambil data mapel', {
      message: getErrorMessage(err),
    });
  }
};

export const createMapel = async (c: Context): Promise<Response> => {
  try {
    await logInfo('Memulai pembuatan mapel baru');

    const body = await c.req.json<CreateMapelDTO>();
    const parsed = CreateMapelSchema.parse(body); // ✅ Validasi Zod
    const createdRow = await service.create(parsed);

    await logInfo('Mapel berhasil dibuat', null);
    return created(c, createdRow, 'Mapel berhasil dibuat');
  } catch (err: unknown) {
    await logError('Gagal membuat mapel', err);
    return badRequest(c, 'Gagal membuat mapel', {
      message: getErrorMessage(err),
    });
  }
};

export const updateMapel = async (c: Context): Promise<Response> => {
  const id = c.req.param('id');
  try {
    await logInfo(`Memulai update mapel ID: ${id}`);

    const body = await c.req.json<UpdateMapelDTO>();
    const parsed = UpdateMapelSchema.parse(body); // ✅ Validasi Zod
    const updated = await service.update(id, parsed);

    await logInfo(`Mapel ID ${id} berhasil diperbarui`, null);
    return ok(c, updated, 'Mapel berhasil diperbarui');
  } catch (err: unknown) {
    await logError(`Gagal update mapel ID: ${id}`, err);
    return badRequest(c, 'Gagal memperbarui mapel', {
      message: getErrorMessage(err),
    });
  }
};

export const deleteMapel = async (c: Context): Promise<Response> => {
  const id = c.req.param('id');
  try {
    await logInfo(`Memulai hapus mapel ID: ${id}`);

    const result = await service.delete(id);

    await logInfo(`Mapel ID ${id} berhasil dihapus`, null);
    return ok(c, result, 'Mapel berhasil dihapus');
  } catch (err: unknown) {
    await logError(`Gagal hapus mapel ID: ${id}`, err);
    return badRequest(c, 'Gagal menghapus mapel', {
      message: getErrorMessage(err),
    });
  }
};

export default {
  getAllMapel,
  getMapelById,
  createMapel,
  updateMapel,
  deleteMapel,
};
