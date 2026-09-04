// src/services/prsMapelService.ts
import PrsMasterMapelRepository from '../repositories/prsMasterMapelRepo';
import xss from 'xss';
import {
  BadRequestException,
  NotFoundException,
} from '../utils/http-exception';
import {
  MapelAttributes,
  MapelCreationAttributes,
} from '../models/PrsMasterMapel';

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isValidUUID(id: string): boolean {
  return UUID_RE.test(id);
}

// hanya string yang disanitize; Date/number dll dibiarkan apa adanya
function sanitizeObject<
  T extends Partial<MapelAttributes> | MapelCreationAttributes,
>(input: T): T {
  const allowed: (keyof MapelAttributes)[] = [
    'nama_mapel',
    'created_at',
    'updated_at',
  ];

  const out: Partial<T> = {};

  for (const key of allowed) {
    const k = key as keyof T;
    const val = input[k];
    if (val !== undefined) {
      if (typeof val === 'string') {
        out[k] = xss(val) as T[typeof k];
      } else {
        out[k] = val as T[typeof k];
      }
    }
  }

  return out as T;
}

class PrsMasterMapelService {
  async getAll(limit = 100): Promise<MapelAttributes[]> {
    return await PrsMasterMapelRepository.findAll(limit);
  }

  async getById(id: string): Promise<MapelAttributes> {
    const cleanId = xss(id);
    if (!isValidUUID(cleanId)) {
      throw new BadRequestException('ID tidak valid (bukan UUID)');
    }
    const data = await PrsMasterMapelRepository.findById(cleanId);
    if (!data) throw new NotFoundException('Data mapel tidak ditemukan');
    return data;
  }

  async create(payload: MapelCreationAttributes): Promise<MapelAttributes> {
    const data = sanitizeObject(payload);
    if (!data.nama_mapel || data.nama_mapel.trim() === '') {
      throw new BadRequestException('Nama mapel wajib diisi');
    }
    return await PrsMasterMapelRepository.create(data);
  }

  async update(
    id: string,
    payload: Partial<MapelAttributes>
  ): Promise<MapelAttributes> {
    const cleanId = xss(id);
    if (!isValidUUID(cleanId)) {
      throw new BadRequestException('ID tidak valid (bukan UUID)');
    }
    const data = sanitizeObject(payload);
    const updated = await PrsMasterMapelRepository.update(cleanId, data);
    if (!updated) throw new NotFoundException('Data mapel tidak ditemukan');
    return updated;
  }

  async delete(id: string): Promise<{ message: string }> {
    const cleanId = xss(id);
    if (!isValidUUID(cleanId)) {
      throw new BadRequestException('ID tidak valid (bukan UUID)');
    }
    const deleted = await PrsMasterMapelRepository.delete(cleanId);
    if (!deleted) throw new NotFoundException('Data mapel tidak ditemukan');
    return { message: 'Berhasil dihapus' };
  }
}

export default new PrsMasterMapelService();
