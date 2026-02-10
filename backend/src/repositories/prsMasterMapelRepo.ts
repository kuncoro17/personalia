// src/repositories/prsMasterMapelRepo.ts
import PrsMasterMapel, {
  MapelAttributes,
  MapelCreationAttributes,
} from '../models/PrsMasterMapel';

class PrsMasterMapelRepository {
  async findAll(limit = 100): Promise<PrsMasterMapel[]> {
    try {
      return await PrsMasterMapel.findAll({
        order: [['nama_mapel', 'ASC']],
        limit,
      });
    } catch (error: unknown) {
      const err = error as Error;
      throw new Error('Gagal mengambil data mapel: ' + err.message);
    }
  }

  async findById(mapel_id: string): Promise<PrsMasterMapel | null> {
    try {
      return await PrsMasterMapel.findByPk(mapel_id);
    } catch (error: unknown) {
      const err = error as Error;
      throw new Error(
        `Gagal mencari mapel dengan ID ${mapel_id}: ` + err.message
      );
    }
  }

  async create(data: MapelCreationAttributes): Promise<PrsMasterMapel> {
    try {
      return await PrsMasterMapel.create(data);
    } catch (error: unknown) {
      const err = error as Error;
      throw new Error('Gagal membuat mapel: ' + err.message);
    }
  }

  async update(
    mapel_id: string,
    data: Partial<MapelAttributes>
  ): Promise<PrsMasterMapel | null> {
    try {
      const found = await PrsMasterMapel.findByPk(mapel_id);
      if (!found) return null;
      return await found.update(data);
    } catch (error: unknown) {
      const err = error as Error;
      throw new Error(
        `Gagal memperbarui mapel dengan ID ${mapel_id}: ` + err.message
      );
    }
  }

  async delete(mapel_id: string): Promise<boolean> {
    try {
      const found = await PrsMasterMapel.findByPk(mapel_id);
      if (!found) return false;
      await found.destroy();
      return true;
    } catch (error: unknown) {
      const err = error as Error;
      throw new Error(
        `Gagal menghapus mapel dengan ID ${mapel_id}: ` + err.message
      );
    }
  }
}

export default new PrsMasterMapelRepository();
