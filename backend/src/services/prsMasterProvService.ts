import {
  PrsMasterProvRepository,
  ProvCreationAttributes,
} from '../repositories/prsMasterProvRepo';
import { ProvAttributes } from '../models/PrsMasterProv';
import {
  BadRequestException,
  NotFoundException,
} from '../utils/http-exception';
import xss from 'xss';

const repository = new PrsMasterProvRepository();

function isValidUUID(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    id
  );
}

function sanitizeObject<T extends Record<string, unknown>>(
  input: Partial<T>
): Partial<T> {
  const sanitized: Partial<T> = {};
  for (const key in input) {
    const val = input[key];
    if (val !== undefined) {
      sanitized[key] =
        typeof val === 'string' ? (xss(val) as unknown as T[typeof key]) : val;
    }
  }
  return sanitized;
}

export class PrsMasterProvService {
  async findAll(): Promise<ProvAttributes[]> {
    return repository.findAll();
  }

  async findById(id: string): Promise<ProvAttributes> {
    if (!isValidUUID(id)) throw new BadRequestException('ID tidak valid');
    const data = await repository.findById(id);
    if (!data) throw new NotFoundException('Data tidak ditemukan');
    return data;
  }

  async create(data: ProvCreationAttributes): Promise<ProvAttributes> {
    const clean = sanitizeObject(data);
    if (!clean.nama) throw new BadRequestException('Field nama wajib diisi');
    return repository.create(clean as ProvCreationAttributes);
  }

  async update(
    id: string,
    data: Partial<ProvAttributes>
  ): Promise<ProvAttributes> {
    if (!isValidUUID(id)) throw new BadRequestException('ID tidak valid');
    const clean = sanitizeObject(data);
    const updated = await repository.update(id, clean);
    if (!updated) throw new NotFoundException('Data tidak ditemukan');
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    if (!isValidUUID(id)) throw new BadRequestException('ID tidak valid');
    const deleted = await repository.delete(id);
    if (!deleted) throw new NotFoundException('Data tidak ditemukan');
    return deleted;
  }
}
