// services/prsPengalamanService.ts
import { PrsPengalamanRepository } from '../repositories/prsPengalamanRepo';
import {
  PengalamanAttributes,
  PengalamanCreationAttributes,
} from '../models/PrsPengalamanKerja';
import {
  BadRequestException,
  NotFoundException,
} from '../utils/http-exception';
import xss from 'xss';

const repository = new PrsPengalamanRepository();

function isValidUUID(id: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    id
  );
}

function sanitize(
  input: Partial<PengalamanCreationAttributes>
): Partial<PengalamanCreationAttributes> {
  const clean: Partial<PengalamanCreationAttributes> = {};

  if (input.karyawan_id) clean.karyawan_id = xss(input.karyawan_id);
  if (input.nama_perusahaan) clean.nama_perusahaan = xss(input.nama_perusahaan);
  if (input.jabatan) clean.jabatan = xss(input.jabatan);

  if (input.mulai_bekerja) {
    clean.mulai_bekerja =
      input.mulai_bekerja instanceof Date
        ? input.mulai_bekerja
        : new Date(input.mulai_bekerja);
  }

  if (input.berhenti_bekerja) {
    clean.berhenti_bekerja =
      input.berhenti_bekerja instanceof Date
        ? input.berhenti_bekerja
        : new Date(input.berhenti_bekerja);
  }

  if (input.alasan_berhenti) clean.alasan_berhenti = xss(input.alasan_berhenti);

  return clean;
}

export class PrsPengalamanService {
  async findAll(): Promise<PengalamanAttributes[]> {
    const data = await repository.findAll();
    return data.map(d => d.toJSON() as PengalamanAttributes);
  }

  async findById(id: string): Promise<PengalamanAttributes> {
    if (!isValidUUID(id)) throw new BadRequestException('ID tidak valid');
    const data = await repository.findById(id);
    if (!data) throw new NotFoundException('Data tidak ditemukan');
    return data.toJSON() as PengalamanAttributes;
  }

  async create(
    data: PengalamanCreationAttributes
  ): Promise<PengalamanAttributes> {
    if (!data.karyawan_id || !data.nama_perusahaan) {
      throw new BadRequestException(
        'Field karyawan_id dan nama_perusahaan wajib diisi'
      );
    }
    const created = await repository.create(
      sanitize(data) as PengalamanCreationAttributes
    );
    return created.toJSON() as PengalamanAttributes;
  }

  async update(
    id: string,
    data: Partial<PengalamanAttributes>
  ): Promise<PengalamanAttributes> {
    if (!isValidUUID(id)) throw new BadRequestException('ID tidak valid');
    const updated = await repository.update(id, sanitize(data));
    if (!updated) throw new NotFoundException('Data tidak ditemukan');
    return updated.toJSON() as PengalamanAttributes;
  }

  async delete(id: string): Promise<boolean> {
    if (!isValidUUID(id)) throw new BadRequestException('ID tidak valid');
    const deleted = await repository.delete(id);
    if (!deleted) throw new NotFoundException('Data tidak ditemukan');
    return deleted;
  }
}

export default new PrsPengalamanService();
