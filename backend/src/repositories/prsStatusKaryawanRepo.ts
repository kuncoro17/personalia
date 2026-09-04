// repositories/prsStatusKaryawanRepo.ts
import PrsStatusKaryawan from '../models/PrsStatusKaryawan';
import {
  PrsStatusKaryawanAttributes,
  PrsStatusKaryawanCreateInput,
} from '../types/prsStatusKaryawan.types';

export class PrsStatusKaryawanRepository {
  async findAll(): Promise<PrsStatusKaryawanAttributes[]> {
    return await PrsStatusKaryawan.findAll({ raw: true });
  }

  async findById(id: string): Promise<PrsStatusKaryawanAttributes | null> {
    return await PrsStatusKaryawan.findByPk(id, { raw: true });
  }

  async create(data: PrsStatusKaryawanCreateInput) {
    return await PrsStatusKaryawan.create(data);
  }

  async update(id: string, data: Partial<PrsStatusKaryawanCreateInput>) {
    const record = await PrsStatusKaryawan.findByPk(id);
    if (!record) return null;
    return await record.update(data);
  }

  async delete(id: string) {
    const record = await PrsStatusKaryawan.findByPk(id);
    if (!record) return null;
    return await record.destroy();
  }
}
