// services/prsStatusKaryawanService.ts
import { PrsStatusKaryawanRepository } from '../repositories/prsStatusKaryawanRepo';
import {
  PrsStatusKaryawanAttributes,
  PrsStatusKaryawanCreateInput,
} from '../types/prsStatusKaryawan.types';
import {
  BadRequestException,
  NotFoundException,
} from '../utils/http-exception';
import xss from 'xss';

const repository = new PrsStatusKaryawanRepository();

function sanitizeObject(
  input: Partial<PrsStatusKaryawanCreateInput>
): Partial<PrsStatusKaryawanCreateInput> {
  const allowedFields: (keyof PrsStatusKaryawanCreateInput)[] = [
    'kode',
    'stat_karyawan',
    'stat_karyawan_gp',
  ];

  const sanitized: Partial<PrsStatusKaryawanCreateInput> = {};
  for (const key of allowedFields) {
    const value = input[key];
    if (value !== null && value !== undefined) {
      sanitized[key] = typeof value === 'string' ? xss(value) : value;
    }
  }
  return sanitized;
}

export class PrsStatusKaryawanService {
  async getAll(): Promise<PrsStatusKaryawanAttributes[]> {
    return await repository.findAll();
  }

  async getById(id: string): Promise<PrsStatusKaryawanAttributes> {
    const data = await repository.findById(xss(id));
    if (!data) throw new NotFoundException('Status karyawan tidak ditemukan');
    return data;
  }

  async create(data: PrsStatusKaryawanCreateInput) {
    const sanitizedData = sanitizeObject(data);

    if (!sanitizedData.kode || sanitizedData.kode.length < 2) {
      throw new BadRequestException(
        'Kode status tidak valid atau terlalu pendek'
      );
    }

    // setelah validasi aman untuk cast
    return await repository.create(
      sanitizedData as PrsStatusKaryawanCreateInput
    );
  }

  async update(id: string, data: Partial<PrsStatusKaryawanCreateInput>) {
    const sanitizedData = sanitizeObject(data);
    const updated = await repository.update(xss(id), sanitizedData);
    if (!updated)
      throw new NotFoundException('Status karyawan tidak ditemukan');
    return updated;
  }

  async delete(id: string) {
    const deleted = await repository.delete(xss(id));
    if (!deleted)
      throw new NotFoundException('Status karyawan tidak ditemukan');
    return deleted;
  }
}
