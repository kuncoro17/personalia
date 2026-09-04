// repositories/prsPengalamanRepo.ts
import PrsPengalaman, {
  PengalamanAttributes,
  PengalamanCreationAttributes,
} from '../models/PrsPengalamanKerja';

export class PrsPengalamanRepository {
  async findAll(): Promise<PrsPengalaman[]> {
    return await PrsPengalaman.findAll({ order: [['mulai_bekerja', 'DESC']] });
  }

  async findById(id: string): Promise<PrsPengalaman | null> {
    return await PrsPengalaman.findByPk(id);
  }

  async create(data: PengalamanCreationAttributes): Promise<PrsPengalaman> {
    return await PrsPengalaman.create(data);
  }

  async update(
    id: string,
    data: Partial<PengalamanAttributes>
  ): Promise<PrsPengalaman | null> {
    const found = await PrsPengalaman.findByPk(id);
    if (!found) return null;
    return await found.update(data);
  }

  async delete(id: string): Promise<boolean> {
    const found = await PrsPengalaman.findByPk(id);
    if (!found) return false;
    await found.destroy();
    return true;
  }
}
