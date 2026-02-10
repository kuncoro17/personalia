import repo from '../repositories/prsKeluargaRepo';
import xss from 'xss';
import PrsKeluargaKaryawan from '../models/PrsKeluargaKaryawan';
import { PrsKeluargaKaryawanAttributes } from '../models/PrsKeluargaKaryawan';
import { CreationAttributes } from 'sequelize';

type PrsKeluargaKaryawanCreateInput = CreationAttributes<PrsKeluargaKaryawan>;

export default {
  sanitize<T extends Record<string, unknown>>(data: T): T {
    const sanitized = {} as T;

    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const value = data[key];

        if (typeof value === 'string') {
          (sanitized[key] as string) = xss(value).trim();
        } else {
          (sanitized[key] as T[typeof key]) = value;
        }
      }
    }

    return sanitized;
  },

  async getAll(): Promise<PrsKeluargaKaryawanAttributes[]> {
    return repo.getAll();
  },

  async getById(id: string): Promise<PrsKeluargaKaryawanAttributes> {
    const data = await repo.getById(xss(id));
    if (!data) throw new Error(`Keluarga dengan ID ${id} tidak ditemukan`);
    return data;
  },

  async getByKaryawanId(
    karyawan_id: string
  ): Promise<PrsKeluargaKaryawanAttributes[]> {
    const data = await repo.getByKaryawanId(xss(karyawan_id));
    if (!data || data.length === 0)
      throw new Error(
        `Data keluarga untuk karyawan ${karyawan_id} tidak ditemukan`
      );
    return data;
  },

  async create(
    data: PrsKeluargaKaryawanCreateInput
  ): Promise<PrsKeluargaKaryawanAttributes> {
    const sanitized = this.sanitize(data);
    return repo.create(sanitized); // ✅ sekarang TS tidak error
  },

  async update(
    id: string,
    data: Partial<PrsKeluargaKaryawanCreateInput>
  ): Promise<PrsKeluargaKaryawanAttributes> {
    const sanitized = this.sanitize(data);
    const updated = await repo.update(xss(id), sanitized);
    if (!updated) throw new Error(`Keluarga dengan ID ${id} tidak ditemukan`);
    return updated;
  },

  async delete(id: string): Promise<PrsKeluargaKaryawanAttributes> {
    const deleted = await repo.delete(xss(id));
    if (!deleted) throw new Error(`Keluarga dengan ID ${id} tidak ditemukan`);
    return deleted;
  },
};
