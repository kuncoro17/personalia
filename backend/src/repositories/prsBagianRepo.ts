import PrsBagian, {
  PrsBagianAttributes,
  PrsBagianCreationAttributes,
} from '../models/PrsBagian';
import PrsUnitKerja from '../models/PrsUnitKerja';
import { Op } from 'sequelize';

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
    const unitRows = await PrsUnitKerja.findAll({
      where: { kode_divisi },
      attributes: ['kode_bagian'],
      raw: true,
    });
    const codes = [
      ...new Set(
        unitRows
          .map(row => row.kode_bagian)
          .filter(code => code && code !== 'nnn')
      ),
    ];

    if (codes.length === 0) return [];

    const bagianRows = await PrsBagian.findAll({
      where: { kode: { [Op.in]: codes } },
      attributes: ['kode', 'nama_bag'],
      order: [['kode', 'ASC']],
      raw: true,
    });

    return bagianRows.map(row => ({
      kode_bagian: row.kode,
      nama_bag: row.nama_bag,
    }));
  },
};

export default PrsBagianRepository;
