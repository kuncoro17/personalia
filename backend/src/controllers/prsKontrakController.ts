import { Context } from 'hono';
import { ok, created, badRequest, notFound } from '../utils/response.helper';
import { logInfo, logWarn, logError } from '../utils/log.helper';
import service from '../services/prsKontrakService';

export const getAllKontrak = async (c: Context): Promise<Response> => {
  try {
    await logInfo('Memulai ambil semua kontrak');
    const data = await service.findAll();

    if (!data || data.length === 0) {
      await logWarn('Tidak ada data kontrak ditemukan', null);
      return notFound(c, 'Tidak ada data kontrak ditemukan');
    }

    await logInfo('Berhasil ambil semua kontrak', null);
    return ok(c, data, 'Berhasil mengambil semua kontrak');
  } catch (err: unknown) {
    await logError('Gagal ambil kontrak', err);
    return badRequest(c, 'Gagal mengambil kontrak', {
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};

export const getKontrakById = async (c: Context): Promise<Response> => {
  const id = c.req.param('id');
  try {
    await logInfo(`Memulai ambil kontrak ID: ${id}`);
    const data = await service.findById(id);

    if (!data) {
      await logWarn(`Kontrak ID ${id} tidak ditemukan`, null);
      return notFound(c, 'Kontrak tidak ditemukan');
    }

    await logInfo(`Berhasil ambil kontrak ID: ${id}`, null);
    return ok(c, data, 'Berhasil mengambil kontrak');
  } catch (err: unknown) {
    await logError(`Gagal ambil kontrak ID: ${id}`, err);
    return badRequest(c, 'Gagal mengambil kontrak', {
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};

export const createKontrak = async (c: Context): Promise<Response> => {
  try {
    await logInfo('Memulai pembuatan kontrak baru');
    const body = await c.req.json();
    const result = await service.create(body);

    await logInfo('Kontrak berhasil dibuat', null);
    return created(c, result, 'Kontrak berhasil ditambahkan');
  } catch (err: unknown) {
    await logError('Gagal membuat kontrak', err);
    return badRequest(c, 'Gagal menambahkan kontrak', {
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};

export const updateKontrak = async (c: Context): Promise<Response> => {
  const id = c.req.param('id');
  try {
    await logInfo(`Memulai update kontrak ID: ${id}`);
    const body = await c.req.json();
    const result = await service.update(id, body);

    if (!result) {
      await logWarn(`Kontrak ID ${id} tidak ditemukan`, null);
      return notFound(c, 'Kontrak tidak ditemukan');
    }

    await logInfo(`Kontrak ID ${id} berhasil diperbarui`, null);
    return ok(c, result, 'Kontrak berhasil diperbarui');
  } catch (err: unknown) {
    await logError(`Gagal update kontrak ID: ${id}`, err);
    return badRequest(c, 'Gagal memperbarui kontrak', {
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};

export const deleteKontrak = async (c: Context): Promise<Response> => {
  const id = c.req.param('id');
  try {
    await logInfo(`Memulai hapus kontrak ID: ${id}`);
    const result = await service.delete(id);

    if (!result) {
      await logWarn(`Kontrak ID ${id} tidak ditemukan`, null);
      return notFound(c, 'Kontrak tidak ditemukan');
    }

    await logInfo(`Kontrak ID ${id} berhasil dihapus`, null);
    return ok(c, result, 'Kontrak berhasil dihapus');
  } catch (err: unknown) {
    await logError(`Gagal hapus kontrak ID: ${id}`, err);
    return badRequest(c, 'Gagal menghapus kontrak', {
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};

export default {
  getAllKontrak,
  getKontrakById,
  createKontrak,
  updateKontrak,
  deleteKontrak,
};
