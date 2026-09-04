import { Context } from 'hono';
import service from '../services/prsKeluargaService';
import { PrsKaryawanService } from '../services/PrsKaryawan.service';
import { ok, created, badRequest, notFound } from '../utils/response.helper';
import { logInfo, logWarn, logError } from '../utils/log.helper';
const serviceKaryawan = new PrsKaryawanService();
type KeluargaDetail = {
  id?: string;
  nama_lengkap?: string;
  agama?: number;
  agama_detail?: { agama?: string };
  nomor_identitas?: string;
  tempat_lahir?: string;
  no_telp?: string;
  tanggal_lahir?: string;
  kewarganegaraan?: string;
  pekerjaan?: string;
  pendidikan?: string;
  gender?: string;
  hubungan?: string;
  flag_status?: number;
  tanggungan_medical?: number;
  kebijakan_khusus_medical?: number;
  flag_berpisah?: number;
  keterangan?: string;
};

type KeluargaUpdated = {
  id: string;
  karyawan_id: string;
  nama_lengkap?: string;
  nomor_identitas?: string;
  tempat_lahir?: string;
  no_telp?: string;
  tanggal_lahir?: string;
  agama?: number;
  kewarganegaraan?: string;
  pekerjaan?: string;
  pendidikan?: string;
  gender?: string;
  hubungan?: string;
  flag_status?: number;
  tanggungan_medical?: number;
  kebijakan_khusus_medical?: number;
  flag_berpisah?: number;
  keterangan?: string;
  keluarga_karyawan?: KeluargaDetail[];
};

export const getAll = async (c: Context): Promise<Response> => {
  try {
    await logInfo('Memulai ambil semua data keluarga');

    const data = await service.getAll();

    if (!data || data.length === 0) {
      await logWarn('Tidak ada data keluarga ditemukan', null);
      return notFound(c, 'Tidak ada data keluarga ditemukan');
    }

    await logInfo('Berhasil ambil semua data keluarga', null);
    return ok(c, data, 'Berhasil mengambil semua keluarga');
  } catch (err: unknown) {
    await logError('Gagal ambil data keluarga', err);
    return badRequest(c, 'Gagal mengambil data keluarga', {
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};

export const getById = async (c: Context): Promise<Response> => {
  const id = c.req.param('id');
  try {
    await logInfo(`Memulai ambil keluarga ID: ${id}`);

    const data = await service.getById(id);

    if (!data) {
      await logWarn(`Keluarga dengan ID ${id} tidak ditemukan`, null);
      return notFound(c, 'Keluarga tidak ditemukan');
    }

    await logInfo(`Berhasil ambil keluarga ID: ${id}`, null);
    return ok(c, data, 'Berhasil mengambil keluarga');
  } catch (err: unknown) {
    await logError(`Gagal ambil keluarga ID: ${id}`, err);
    return badRequest(c, 'Gagal mengambil keluarga', {
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};

export const getByKaryawanId = async (c: Context): Promise<Response> => {
  const karyawan_id = c.req.param('karyawan_id');
  try {
    await logInfo(`Memulai ambil keluarga untuk karyawan ID: ${karyawan_id}`);

    const data = await service.getByKaryawanId(karyawan_id);

    if (!data || data.length === 0) {
      await logWarn(
        `Tidak ada keluarga ditemukan untuk karyawan ID: ${karyawan_id}`,
        null
      );
      return notFound(c, 'Tidak ada keluarga ditemukan');
    }

    await logInfo(
      `Berhasil ambil keluarga untuk karyawan ID: ${karyawan_id}`,
      null
    );
    return ok(c, data, 'Berhasil mengambil keluarga');
  } catch (err: unknown) {
    await logError(
      `Gagal ambil keluarga untuk karyawan ID: ${karyawan_id}`,
      err
    );
    return badRequest(c, 'Gagal mengambil keluarga', {
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};

export const create = async (c: Context): Promise<Response> => {
  try {
    await logInfo('Memulai pembuatan data keluarga baru');

    const body = await c.req.json();

    const createdData = await service.create(body);

    const updated = await serviceKaryawan.getKeluargaByKaryawanIdAndId(
      createdData.karyawan_id,
      createdData.id
    );

    if (!updated) {
      return notFound(c, 'Data keluarga tidak ditemukan');
    }

    // ⬇️ LANGSUNG CAST (tanpa .get)
    const plainUpdated = updated as unknown as KeluargaUpdated;

    const keluarga = (plainUpdated.keluarga_karyawan ?? []).map(kel => ({
      ...kel,
      nama_agama: kel.agama_detail?.agama ?? null,
      agama_detail: undefined,
    }));

    await logInfo('Data keluarga berhasil dibuat');

    return created(c, {
      success: true,
      message: 'Keluarga berhasil ditambahkan',
      data: {
        ...plainUpdated,
        keluarga_karyawan: keluarga,
      },
    });
  } catch (err: unknown) {
    await logError('Gagal membuat data keluarga', err);

    return badRequest(
      c,
      err instanceof Error ? err.message : 'Gagal menambahkan keluarga'
    );
  }
};

export const update = async (c: Context): Promise<Response> => {
  const id = c.req.param('id');
  try {
    await logInfo(`Memulai update data keluarga ID: ${id}`);

    const body = await c.req.json();
    const result = await service.update(id, body);

    await logInfo(`Data keluarga ID: ${id} berhasil diperbarui`, null);
    return ok(c, result, 'Keluarga berhasil diperbarui');
  } catch (err: unknown) {
    await logError(`Gagal update data keluarga ID: ${id}`, err);
    return badRequest(c, 'Gagal memperbarui keluarga', {
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};

export const remove = async (c: Context): Promise<Response> => {
  const id = c.req.param('id');
  try {
    await logInfo(`Memulai hapus data keluarga ID: ${id}`);

    await service.delete(id);

    await logInfo(`Data keluarga ID: ${id} berhasil dihapus`, null);
    return ok(c, null, 'Keluarga berhasil dihapus');
  } catch (err: unknown) {
    await logError(`Gagal hapus data keluarga ID: ${id}`, err);
    return badRequest(c, 'Gagal menghapus keluarga', {
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};

export default {
  getAll,
  getById,
  getByKaryawanId,
  create,
  update,
  remove,
};
