import {
  PrsMasterDirektur,
  PrsMasterDirekturAttributes,
  PrsMasterDirekturCreationAttributes,
} from '../models/PrsMasterDirektur';

const PrsMasterDirekturRepository = {
  async findAll(): Promise<PrsMasterDirektur[]> {
    return await PrsMasterDirektur.findAll({ order: [['nama_dir', 'ASC']] });
  },

  async findById(id: string): Promise<PrsMasterDirektur | null> {
    return await PrsMasterDirektur.findByPk(id);
  },

  async create(
    data: PrsMasterDirekturCreationAttributes
  ): Promise<PrsMasterDirektur> {
    return await PrsMasterDirektur.create(data);
  },

  async findByKode(kode: string): Promise<PrsMasterDirektur | null> {
    try {
      return await PrsMasterDirektur.findOne({ where: { kode } });
    } catch {
      throw new Error('Gagal mencari kode direktur');
    }
  },

  async update(
    id: string,
    data: Partial<PrsMasterDirekturAttributes>
  ): Promise<PrsMasterDirektur | null> {
    const record = await PrsMasterDirektur.findByPk(id);
    if (!record) return null;
    return await record.update(data);
  },

  async delete(id: string): Promise<boolean | null> {
    const record = await PrsMasterDirektur.findByPk(id);
    if (!record) return null;
    await record.destroy();
    return true;
  },
};

export default PrsMasterDirekturRepository;
