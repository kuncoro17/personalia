import { PrsMasterKecRepository } from '../repositories/prsMasterKecRepo';
import {
  BadRequestException,
  NotFoundException,
} from '../utils/http-exception';
import xss from 'xss';

const repository = new PrsMasterKecRepository();

// ✅ Definisikan type langsung di services
export interface KecInput {
  nama: string;
  kot_id: string;
  created_at?: Date;
  updated_at?: Date;
}

// UUID validator
function isValidUUID(id: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    id
  );
}

// Generic sanitize function tanpa any
function sanitizeObject<T extends object>(
  input: Partial<T>,
  allowedFields: (keyof T)[]
): Partial<T> {
  const sanitized: Partial<T> = {};
  for (const key of allowedFields) {
    const value = input[key];
    if (value !== undefined) {
      sanitized[key] =
        typeof value === 'string'
          ? (xss(value) as unknown as T[typeof key])
          : value;
    }
  }
  return sanitized;
}

export class PrsMasterKecService {
  private allowedFields: (keyof KecInput)[] = [
    'nama',
    'kot_id',
    'created_at',
    'updated_at',
  ];

  async findAll() {
    return await repository.findAll();
  }

  async findById(id: string) {
    if (!isValidUUID(id)) throw new BadRequestException('ID tidak valid');
    const data = await repository.findById(id);
    if (!data) throw new NotFoundException('Data tidak ditemukan');
    return data;
  }

  async findByKotId(kot_id: string) {
    if (!isValidUUID(kot_id))
      throw new BadRequestException('ID kota tidak valid');

    const data = await repository.findByKotId(kot_id);
    if (!data || data.length === 0)
      throw new NotFoundException('Data kecamatan tidak ditemukan');

    return data;
  }

  async create(data: KecInput) {
    const clean = sanitizeObject<KecInput>(data, this.allowedFields);

    if (!clean.nama || !clean.kot_id) {
      throw new BadRequestException('Field nama dan kot_id wajib diisi');
    }

    return await repository.create(clean);
  }

  async update(id: string, data: Partial<KecInput>) {
    if (!isValidUUID(id)) throw new BadRequestException('ID tidak valid');

    const clean = sanitizeObject<Partial<KecInput>>(data, this.allowedFields);
    const updated = await repository.update(id, clean);

    if (!updated) throw new NotFoundException('Data tidak ditemukan');
    return updated;
  }

  async delete(id: string) {
    if (!isValidUUID(id)) throw new BadRequestException('ID tidak valid');

    const deleted = await repository.delete(id);
    if (!deleted) throw new NotFoundException('Data tidak ditemukan');
    return deleted;
  }
}
