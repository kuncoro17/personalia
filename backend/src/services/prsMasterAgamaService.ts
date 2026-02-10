// src/services/prsMasterAgamaService.ts
import repo from '../repositories/prsMasterAgamaRepo';
import xss from 'xss';
import {
  BadRequestException,
  NotFoundException,
} from '../utils/http-exception';
import { z } from 'zod';

// DTO + Schema
export const PrsMasterAgamaSchema = z.object({
  agama: z.string().min(1, 'Agama wajib diisi'),
});
export type PrsMasterAgamaDTO = z.infer<typeof PrsMasterAgamaSchema>;

// Sanitasi
function sanitizeObject<T extends Record<string, unknown>>(
  input: T,
  allowedFields: (keyof T)[]
): Partial<T> {
  const sanitized: Partial<T> = {};
  for (const key of allowedFields) {
    const value = input[key];
    sanitized[key] =
      typeof value === 'string'
        ? (xss(value) as unknown as T[typeof key])
        : value;
  }
  return sanitized;
}

// Validasi ID numerik
function isValidNumericId(id: number): boolean {
  return !isNaN(Number(id)) && Number(id) > 0;
}

class PrsMasterAgamaService {
  private allowedFields: (keyof PrsMasterAgamaDTO)[] = ['agama'];

  async getAll() {
    return repo.findAll();
  }

  async getById(kode_agama: number) {
    if (!isValidNumericId(kode_agama))
      throw new BadRequestException('ID tidak valid');
    const data = await repo.findById(kode_agama);
    if (!data) throw new NotFoundException('Data tidak ditemukan');
    return data;
  }

  async create(data: PrsMasterAgamaDTO) {
    const parsed = PrsMasterAgamaSchema.safeParse(data);
    if (!parsed.success) {
      throw new BadRequestException(
        parsed.error.issues.map(e => e.message).join(', ')
      );
    }

    const sanitized = sanitizeObject(
      parsed.data,
      this.allowedFields
    ) as PrsMasterAgamaDTO;
    return repo.create(sanitized);
  }

  async update(kode_agama: number, data: PrsMasterAgamaDTO) {
    if (!isValidNumericId(kode_agama))
      throw new BadRequestException('ID tidak valid');

    const parsed = PrsMasterAgamaSchema.safeParse(data);
    if (!parsed.success) {
      throw new BadRequestException(
        parsed.error.issues.map(e => e.message).join(', ')
      );
    }

    const sanitized = sanitizeObject(
      parsed.data,
      this.allowedFields
    ) as PrsMasterAgamaDTO;
    const updated = await repo.update(kode_agama, sanitized);
    if (!updated) throw new NotFoundException('Data tidak ditemukan');
    return updated;
  }

  async delete(kode_agama: number) {
    if (!isValidNumericId(kode_agama))
      throw new BadRequestException('ID tidak valid');
    const deleted = await repo.delete(kode_agama);
    if (!deleted) throw new NotFoundException('Data tidak ditemukan');
    return deleted;
  }
}

export default new PrsMasterAgamaService();
