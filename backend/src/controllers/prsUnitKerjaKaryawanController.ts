import { Context } from 'hono';
import { PrsUnitKerjaKaryawanService } from '../services/prsUnitKerjaKaryawanService';
import { ok, created, badRequest, notFound } from '../utils/response.helper';
import { logInfo, logWarn, logError } from '../utils/log.helper';
import { CreatePrsUnitKerjaKaryawanDTO } from '../types/prsUnitKerjaKaryawanCreateDTO';
import { ZodError } from 'zod';
// DTO untuk request create / update
interface UnitKerjaKaryawanDTO {
  karyawan_id: string;
  unit_kerja: string;
  jab_id: string;
  lokasi_penggajian: string;
}

const service = new PrsUnitKerjaKaryawanService();

export const getAll = async (c: Context) => {
  try {
    await logInfo('Memulai ambil semua data');
    const data = await service.findAll();

    await logInfo('Berhasil ambil semua data', null);
    return ok(c, data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    await logError('Gagal ambil semua data', err);
    return badRequest(c, message);
  }
};

export const getById = async (c: Context) => {
  const id = c.req.param('id');
  try {
    await logInfo(`Memulai ambil data ID: ${id}`);
    const data = await service.findById(id);

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

export const create = async (c: Context) => {
  try {
    await logInfo('Memulai pembuatan data baru');

    const body: CreatePrsUnitKerjaKaryawanDTO = await c.req.json();

    const createdData = await service.create(body);

    // Cast ke unknown dulu
    const plain: Record<string, unknown> =
      createdData && typeof createdData === 'object'
        ? 'toJSON' in createdData && typeof createdData.toJSON === 'function'
          ? createdData.toJSON()
          : (createdData as unknown as Record<string, unknown>)
        : {};

    await logInfo(
      `Data berhasil dibuat ID: ${'id' in plain ? plain.id : 'tidak tersedia'}`,
      null
    );

    return created(c, plain, 'Data berhasil dibuat');
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    await logError('Gagal membuat data', err);
    return badRequest(c, message);
  }
};

export const update = async (c: Context) => {
  const id = c.req.param('id');
  try {
    await logInfo(`Memulai update data ID: ${id}`);
    const body: Partial<UnitKerjaKaryawanDTO> = await c.req.json();
    const updated = await service.update(id, body);

    await logInfo(`Data berhasil diperbarui ID: ${id}`, null);
    return ok(c, updated, 'Data berhasil diperbarui');
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    await logError(`Gagal update data ID: ${id}`, err);
    return badRequest(c, message);
  }
};
export const updateKarywan = async (c: Context) => {
  const idKaryawan = c.req.param('id_karyawan');
  try {
    await logInfo(`Memulai update data berdasarkan id_karyawan: ${idKaryawan}`);
    const body: Partial<UnitKerjaKaryawanDTO> = await c.req.json();
    const updated = await service.updateByKaryawanId(idKaryawan, body);

    await logInfo(`Data berhasil diperbarui id_karyawan: ${idKaryawan}`);
    return ok(c, updated, 'Data berhasil diperbarui');
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    await logError(`Gagal update data id_karyawan: ${idKaryawan}`, err);
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
export const updateByJabId = async (c: Context): Promise<Response> => {
  const karyawan_id = c.req.param('karyawan_id');
  const service = new PrsUnitKerjaKaryawanService();

  try {
    await logInfo(
      `🟢 Memulai update unit kerja berdasarkan karyawan_id: ${karyawan_id}`
    );

    let body: Record<string, any>;
    const contentType = c.req.header('content-type') ?? '';

    if (contentType.includes('application/json')) {
      body = await c.req.json();
    } else if (contentType.includes('multipart/form-data')) {
      const form = await c.req.formData();
      body = {};

      // ✅ TypeScript-safe FormData parsing
      for (const [key, value] of form as any) {
        body[key] = value;
      }
    } else {
      return badRequest(c, 'Unsupported Content-Type');
    }

    await logInfo('📦 Parsed body', JSON.stringify(body, null, 2));

    const updatedData = await service.updateByJabId(karyawan_id, body);

    await logInfo(
      `✅ Data unit kerja dengan karyawan_id ${karyawan_id} berhasil diperbarui`
    );

    return ok(c, updatedData, 'Data unit kerja berhasil diperbarui');
  } catch (err) {
    if (err instanceof ZodError) {
      await logWarn('⚠️ Validasi input gagal', err.issues);
      return badRequest(c, 'Validasi gagal', err.issues);
    }

    if (err instanceof Error && err.message.includes('tidak ditemukan')) {
      await logWarn(
        `⚠️ Data dengan karyawan_id ${karyawan_id} tidak ditemukan`
      );
      return notFound(c, err.message);
    }

    await logError(
      `❌ Gagal update unit kerja dengan karyawan_id: ${karyawan_id}`,
      err
    );

    return badRequest(c, 'Gagal memperbarui data', {
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};
