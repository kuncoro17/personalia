import { PrsMasterKelRepository } from '../repositories/prsMasterKelRepo';
import {
  BadRequestException,
  NotFoundException,
} from '../utils/http-exception';
import xss from 'xss';

const repository = new PrsMasterKelRepository();

// 🔹 Definisi interface langsung di sini
export interface KelInput {
  nama: string;
  kec_id: string;
  created_at?: Date;
  updated_at?: Date;
}

function isValidUUID(id: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    id
  );
}

function sanitizeObject<T extends object>(input: T): Partial<T> {
  const allowed = ['nama', 'kec_id', 'created_at', 'updated_at'] as const;
  const sanitized: Partial<T> = {};

  for (const key of allowed) {
    if (input[key as keyof T] !== undefined) {
      const value = input[key as keyof T];
      if (typeof value === 'string') {
        sanitized[key as keyof T] = xss(value) as T[keyof T];
      } else {
        sanitized[key as keyof T] = value;
      }
    }
  }

  return sanitized;
}

export class PrsMasterKelService {
  async findAll() {
    return await repository.findAll();
  }

  async findById(id: string) {
    if (!isValidUUID(id)) throw new BadRequestException('ID tidak valid');
    const data = await repository.findById(id);
    if (!data) throw new NotFoundException('Data tidak ditemukan');
    return data;
  }
  async findByKecId(kec_id: string) {
    if (!isValidUUID(kec_id))
      throw new BadRequestException('ID kecamatan tidak valid');

    const data = await repository.findByKecId(kec_id);
    if (!data || data.length === 0)
      throw new NotFoundException('Data kelurahan tidak ditemukan');

    return data;
  }
  async create(data: KelInput) {
    const clean = sanitizeObject(data);

    if (!clean.nama || !clean.kec_id) {
      throw new BadRequestException('Field nama dan kec_id wajib diisi');
    }

    // 🔹 Mapping input ke tipe Sequelize
    const payload = {
      nama: clean.nama,
      kec_id: clean.kec_id,
      created_at: clean.created_at,
      updated_at: clean.updated_at,
    };

    return await repository.create(payload); // sekarang sudah sesuai tipe KelCreationAttributes
  }

  async update(id: string, data: Partial<KelInput>) {
    if (!isValidUUID(id)) throw new BadRequestException('ID tidak valid');
    const clean = sanitizeObject(data);
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
