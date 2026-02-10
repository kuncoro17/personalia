// services/jamMengajarService.ts
import repo from '../repositories/jamMengajarRepository';
import { z } from 'zod';
import xss from 'xss';
import {
  BadRequestException,
  NotFoundException,
} from '../utils/http-exception';

const schema = z.object({
  ukk_id: z.string().uuid().optional(),
  jam_mengajar: z.number().optional(),
  mengajar_mapel: z.string().uuid().optional(),
  jab_id: z.string().uuid().optional(),
});
type UpdatePayload = z.infer<typeof updateSchema>;
const updateSchema = z.object({
  jam_mengajar: z.number().nonnegative().optional(),
  mengajar_mapel: z.string().uuid().optional(),
  mata_pelajaran: z.string().uuid().optional(),
  lokasi_kerja: z.string().uuid().optional(),
  jabatan: z.string().optional(),
  jab_id: z.string().optional(),
});

interface JamMengajarInput {
  ukk_id?: string;
  jam_mengajar?: number | string;
  mengajar_mapel?: string;
}

export function sanitize(data: JamMengajarInput) {
  return {
    ukk_id: xss(data.ukk_id ?? ''),
    jam_mengajar: Number(data.jam_mengajar ?? 0),
    mengajar_mapel: xss(data.mengajar_mapel ?? '').trim(),
  };
}
// const updateSchema = z.object({
//   jam_mengajar: z.number().optional(),
//   mengajar_mapel: z.string().uuid().optional(),
// });

class PrsJamMengajarServices {
  async getAll() {
    return repo.getAll();
  }

  async getById(id: string) {
    const data = await repo.getById(xss(id));
    if (!data)
      throw new NotFoundException(`Data dengan ID ${id} tidak ditemukan`);
    return data;
  }

  async create(body: unknown) {
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      const message = parsed.error.issues.map(i => i.message).join(', ');
      throw new BadRequestException(message);
    }
    const sanitized = sanitize(parsed.data);
    return repo.create(sanitized);
  }

  async update(id: string, body: unknown) {
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      const message = parsed.error.issues.map(i => i.message).join(', ');
      throw new BadRequestException(message);
    }

    const exist = await repo.getById(xss(id));
    if (!exist)
      throw new NotFoundException(`Data dengan ID ${id} tidak ditemukan`);

    const sanitized = sanitize(parsed.data);
    return repo.update(xss(id), sanitized);
  }

  async delete(id: string) {
    const exist = await repo.getById(xss(id));
    if (!exist)
      throw new NotFoundException(`Data dengan ID ${id} tidak ditemukan`);
    return repo.delete(xss(id));
  }
  async getJamMengajarByIdKaryawan(id_karyawan: string) {
    if (!id_karyawan || id_karyawan.trim() === '') {
      throw new BadRequestException('id_karyawan wajib diisi');
    }

    const safeId = xss(id_karyawan);
    const data = await repo.GetJamMengajarByIdKaryawan(safeId);

    if (!data || data.length === 0) {
      throw new NotFoundException(
        `Data jam mengajar untuk ID karyawan ${id_karyawan} tidak ditemukan`
      );
    }

    // 🔹 Flatten hasil: ubah key dengan titik jadi key datar
    interface RawDataItem {
      ukk_id?: string | null;
      unit_kerja?: string | null;
      jab_id?: string | null;
      'karyawan.id_karyawan'?: string | null;
      'jam_mengajar.jmk_id'?: string | null;
      'jam_mengajar.jam_mengajar'?: string | null;
      'jam_mengajar.mengajar_mapel'?: string | null;
      'jam_mengajar.mapel.mata_pelajaran'?: string | null;
      // 'jam_mengajar.mapel.nama_mapel'?: string | null; // opsional
    }

    // 2️⃣ Definisikan tipe hasil akhir
    interface MappedItem {
      ukk_id: string;
      unit_kerja: string;
      jab_id: string;
      id_karyawan: string;
      jmk_id: string;
      jam_mengajar: string;
      mengajar_mapel: string;
      mata_pelajaran: string;
      // nama_mapel?: string;
    }

    // 3️⃣ Mapping data type-safe
    const result: MappedItem[] = data.map((item: RawDataItem) => ({
      ukk_id: item.ukk_id ?? '',
      unit_kerja: item.unit_kerja ?? '',
      jab_id: item.jab_id ?? '',
      id_karyawan: item['karyawan.id_karyawan'] ?? '',
      jmk_id: item['jam_mengajar.jmk_id'] ?? '',
      jam_mengajar: item['jam_mengajar.jam_mengajar'] ?? '',
      mengajar_mapel: item['jam_mengajar.mengajar_mapel'] ?? '',
      mata_pelajaran: item['jam_mengajar.mapel.mata_pelajaran'] ?? '',
      // nama_mapel: item['jam_mengajar.mapel.nama_mapel'] ?? '',
    }));

    return result;
  }

  async updateByIdKaryawanAndUkkId(
    id_karyawan: string,
    ukk_id: string,
    payload: unknown // tetap unknown dari luar, akan di-parse
  ) {
    // validasi payload
    const parsed = updateSchema.safeParse(payload);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.issues[0].message);
    }

    const {
      jam_mengajar,
      mengajar_mapel,
      mata_pelajaran,
      lokasi_kerja,
      jabatan,
      jab_id,
    } = parsed.data;

    const finalJabId = jabatan ?? jab_id;

    if (
      jam_mengajar === undefined &&
      mengajar_mapel === undefined &&
      mata_pelajaran === undefined &&
      lokasi_kerja === undefined &&
      finalJabId === undefined
    ) {
      throw new BadRequestException(
        'Minimal salah satu field harus diisi: jam_mengajar, mengajar_mapel, mata_pelajaran, jabatan, jab_id, atau lokasi_kerja.'
      );
    }

    // build payload type-safe
    const finalPayload: Partial<
      UpdatePayload & { unit_kerja?: string; jabatan?: string }
    > = {};

    if (jam_mengajar !== undefined) finalPayload.jam_mengajar = jam_mengajar;
    if (mengajar_mapel !== undefined)
      finalPayload.mengajar_mapel = xss(mengajar_mapel);
    if (mata_pelajaran !== undefined)
      finalPayload.mata_pelajaran = xss(mata_pelajaran);

    // mapping lokasi_kerja → unit_kerja
    if (lokasi_kerja !== undefined) finalPayload.unit_kerja = xss(lokasi_kerja);

    if (finalJabId !== undefined) finalPayload.jabatan = xss(finalJabId);

    const updated = await repo.updateByIdKaryawanAndUkkId(
      id_karyawan,
      ukk_id,
      finalPayload
    );
    return updated;
  }
}
export default PrsJamMengajarServices;
