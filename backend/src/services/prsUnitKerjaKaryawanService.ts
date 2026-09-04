import { PrsUnitKerjaKaryawanRepository } from '../repositories/prsUnitKerjaKaryawanRepo';
import { z } from 'zod';
import {
  BadRequestException,
  NotFoundException,
} from '../utils/http-exception';
import xss from 'xss';

const repository = new PrsUnitKerjaKaryawanRepository();

// ✅ DTO final
export interface PrsUnitKerjaKaryawanDTO {
  ukk_id: string;
  karyawan_id: string; // ✅ ubah ke string, bukan UUID
  unit_kerja: string;
  jab_id: string;
  lokasi_penggajian: string;
  created_at?: Date | null;
  updated_at?: Date | null;
  deleted_at?: Date | null;
}

// Contoh schema
const unitKerjaSchema = z.object({
  karyawan_id: z.string().uuid().optional(),
  unit_kerja: z.string().optional(),
  jab_id: z.string().optional(),
  lokasi_penggajian: z.string().optional(),
});

// Ambil tipe dari schema
type UnitKerjaPayload = z.infer<typeof unitKerjaSchema>;

type UnitKerjaInput = z.infer<typeof unitKerjaSchema>;

// ✅ Validator UUID manual
function isValidUUID(id: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    id
  );
}

// ✅ Sanitasi input
function sanitizeInput(
  input: Partial<UnitKerjaInput>
): Partial<UnitKerjaInput> {
  const sanitized: Partial<UnitKerjaInput> = {};
  if (input.karyawan_id !== undefined)
    sanitized.karyawan_id = xss(input.karyawan_id);
  if (input.unit_kerja !== undefined)
    sanitized.unit_kerja = xss(input.unit_kerja);
  if (input.jab_id !== undefined) sanitized.jab_id = xss(input.jab_id);
  if (input.lokasi_penggajian !== undefined)
    sanitized.lokasi_penggajian = xss(input.lokasi_penggajian);
  return sanitized;
}

export class PrsUnitKerjaKaryawanService {
  async findAll(): Promise<PrsUnitKerjaKaryawanDTO[]> {
    return repository.findAll();
  }

  async findById(id: string): Promise<PrsUnitKerjaKaryawanDTO> {
    if (!isValidUUID(id)) throw new BadRequestException('ID tidak valid');
    const data = await repository.findById(id);
    if (!data) throw new NotFoundException('Data tidak ditemukan');
    return data;
  }

  async create(
    data: PrsUnitKerjaKaryawanDTO
  ): Promise<PrsUnitKerjaKaryawanDTO> {
    const clean = sanitizeInput(data);
    if (!clean.karyawan_id)
      throw new BadRequestException('ID Karyawan wajib diisi');
    return repository.create(clean as PrsUnitKerjaKaryawanDTO);
  }

  async update(
    id: string,
    data: Partial<PrsUnitKerjaKaryawanDTO>
  ): Promise<PrsUnitKerjaKaryawanDTO> {
    if (!isValidUUID(id)) throw new BadRequestException('ID tidak valid');
    const clean = sanitizeInput(data);
    const updated = await repository.update(id, clean);
    if (!updated) throw new NotFoundException('Data tidak ditemukan');
    return updated;
  }

  async updateByKaryawanId(
    idKaryawan: string,
    data: Partial<PrsUnitKerjaKaryawanDTO>
  ): Promise<PrsUnitKerjaKaryawanDTO> {
    if (!isValidUUID(idKaryawan))
      throw new BadRequestException('id_karyawan tidak valid');

    const clean = sanitizeInput(data);
    const updated = await repository.updateByKaryawanId(idKaryawan, clean);

    if (!updated)
      throw new NotFoundException(
        'Data unit kerja untuk karyawan ini tidak ditemukan'
      );

    return updated;
  }

  async delete(id: string): Promise<boolean> {
    if (!isValidUUID(id)) throw new BadRequestException('ID tidak valid');
    const deleted = await repository.delete(id);
    if (!deleted) throw new NotFoundException('Data tidak ditemukan');
    return deleted;
  }

  async updateByJabId(karyawan_id: string, data: unknown) {
    // pastikan karyawan_id adalah UUID string
    if (!isValidUUID(karyawan_id)) {
      throw new BadRequestException('id_karyawan tidak valid');
    }

    // parsing & sanitize
    const parsed = unitKerjaSchema.partial().parse(data);
    const sanitized = sanitizeInput(parsed);

    // Definisikan payload type-safe
    const updatePayload: Partial<UnitKerjaPayload> = {};

    if (sanitized.unit_kerja !== undefined)
      updatePayload.unit_kerja = sanitized.unit_kerja;
    if (sanitized.jab_id !== undefined) updatePayload.jab_id = sanitized.jab_id;
    if (sanitized.lokasi_penggajian !== undefined)
      updatePayload.lokasi_penggajian = sanitized.lokasi_penggajian;

    // Pastikan ada record unit kerja untuk karyawan tsb.
    const existing = await repository.findByIdKaryawan(karyawan_id);
    if (!existing) {
      if (!updatePayload.unit_kerja || !updatePayload.jab_id) {
        throw new NotFoundException(
          'Data unit kerja tidak ditemukan (butuh unit_kerja dan jabatan untuk membuat baru)'
        );
      }

      return await repository.create({
        karyawan_id,
        unit_kerja: updatePayload.unit_kerja,
        jab_id: updatePayload.jab_id,
        lokasi_penggajian: updatePayload.lokasi_penggajian ?? '',
      } as unknown as PrsUnitKerjaKaryawanDTO);
    }

    const updated = await repository.updateByKaryawanId(
      karyawan_id,
      updatePayload
    );
    return updated;
  }
}

export default new PrsUnitKerjaKaryawanService();
