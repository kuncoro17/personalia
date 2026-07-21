import { Context } from 'hono';
import * as service from '../services/prsDokumenService';
import { logInfo, logError } from '../utils/log.helper';
import { ok, created, badRequest, notFound } from '../utils/response.helper';
import { UploadedFile } from '../helper/fileHelper';

type FileInput = File | UploadedFile | string | null | undefined;

const convertToUploadedFile = async (
  file: FileInput
): Promise<UploadedFile | null> => {
  if (!file) return null;

  if (typeof file === 'string') {
    return {
      originalname: file.split('/').pop() || file,
      mimetype: 'application/octet-stream',
      buffer: Buffer.from(''),
      size: 0,
    };
  }

  if (file instanceof File) {
    const buffer = Buffer.from(await file.arrayBuffer());
    return {
      originalname: file.name,
      mimetype: file.type,
      buffer,
      size: file.size,
    };
  }

  if ('originalname' in file && 'mimetype' in file && 'buffer' in file) {
    return file as UploadedFile;
  }

  throw new Error('Format file tidak dikenali');
};

// ---- CREATE ----
export const createDokumen = async (c: Context): Promise<Response> => {
  try {
    const body = await c.req.parseBody();
    const result = await service.create({
      karyawan_id: body['karyawan_id'] as string,
      tipe_dokumen_id: body['tipe_dokumen_id'] as string,
      dokumen: await convertToUploadedFile(body['dokumen']),
    });

    await logInfo('Dokumen berhasil dibuat', null);
    return created(c, result, 'Dokumen berhasil dibuat');
  } catch (err: unknown) {
    await logError('Gagal membuat dokumen', err);
    return badRequest(c, err instanceof Error ? err.message : 'Unknown error');
  }
};

// ---- GET ALL ----
export const getAll = async (c: Context): Promise<Response> => {
  try {
    const result = await service.getAll();
    return ok(c, result);
  } catch (err: unknown) {
    return badRequest(c, err instanceof Error ? err.message : 'Unknown error');
  }
};

// ---- GET BY ID ----
export const getDokumen = async (c: Context): Promise<Response> => {
  const id = c.req.param('id');
  const result = await service.getById(id);
  if (!result) return notFound(c, 'Dokumen tidak ditemukan');
  return ok(c, result);
};

export const getDokumenByKaryawan = async (c: Context): Promise<Response> => {
  try {
    const karyawanId = c.req.param('karyawanId');
    const result = await service.getByKaryawanId(karyawanId);
    return ok(c, result);
  } catch (err: unknown) {
    await logError('Gagal mengambil dokumen karyawan', err);
    return badRequest(c, err instanceof Error ? err.message : 'Unknown error');
  }
};

// ---- UPDATE ----
export const updateDokumen = async (c: Context): Promise<Response> => {
  try {
    const id = c.req.param('id');
    const body = await c.req.parseBody();
    const result = await service.updateDokumenService(id, {
      karyawan_id: body['karyawan_id'] as string,
      tipe_dokumen_id: body['tipe_dokumen_id'] as string,
      dokumen: await convertToUploadedFile(body['dokumen']),
    });

    return ok(c, result, 'Dokumen berhasil diperbarui');
  } catch (err: unknown) {
    await logError('Gagal update dokumen', err);
    return badRequest(c, err instanceof Error ? err.message : 'Unknown error');
  }
};

// ---- DELETE ----
export const deleteDokumen = async (c: Context): Promise<Response> => {
  const id = c.req.param('id');
  const result = await service.remove(id);
  if (!result) return notFound(c, 'Dokumen tidak ditemukan');
  return ok(c, result, 'Dokumen berhasil dihapus');
};
