import PrsBagian, {
  PrsBagianAttributes,
  PrsBagianCreationAttributes,
} from '../models/PrsBagian';
import PrsUnitKerja from '../models/PrsUnitKerja';
import { col } from 'sequelize';

const PrsBagianRepository = {
  async findAll(): Promise<PrsBagian[]> {
    return await PrsBagian.findAll({ order: [['created_at', 'DESC']] });
  },

  async findById(id: string): Promise<PrsBagian | null> {
    return await PrsBagian.findByPk(id);
  },

  async create(data: PrsBagianCreationAttributes): Promise<PrsBagian> {
    return await PrsBagian.create(data);
  },

  async update(
    id: string,
    data: Partial<PrsBagianAttributes>
  ): Promise<PrsBagian | null> {
    const record = await PrsBagian.findByPk(id);
    if (!record) return null;
    await record.update({ ...data });
    return record;
  },

  async delete(id: string): Promise<boolean> {
    const deletedCount = await PrsBagian.destroy({ where: { bag_id: id } });
    return deletedCount > 0;
  },

  async findByKodeDivisi(
    kode_divisi: string
  ): Promise<{ kode_bagian: string; nama_bag: string }[]> {
    const result = await PrsUnitKerja.findAll({
      where: { kode_divisi },
      attributes: [
        [col('bagian.kode'), 'kode_bagian'],
        [col('bagian.nama_bag'), 'nama_bag'],
      ],
      include: [{ model: PrsBagian, as: 'bagian', attributes: [] }],
      group: ['PrsUnitKerja.kode_divisi', 'bagian.kode', 'bagian.nama_bag'],
      order: [[col('bagian.kode'), 'ASC']],
      raw: true,
    });

    // cast ke unknown dulu supaya TypeScript percaya
    return result as unknown as { kode_bagian: string; nama_bag: string }[];
  },
};

export default PrsBagianRepository;
