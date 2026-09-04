// repositories/prsSeksiRepository.ts
import PrsSeksi, {
  PrsSeksiAttributes,
  PrsSeksiCreationAttributes,
} from '../models/PrsSeksi';

import PrsUnitKerja from '../models/PrsUnitKerja';

const PrsSeksiRepository = {
  async findAll(): Promise<PrsSeksi[]> {
    return await PrsSeksi.findAll({ order: [['created_at', 'DESC']] });
  },

  async findById(id: string): Promise<PrsSeksi | null> {
    return await PrsSeksi.findByPk(id);
  },

  async create(data: PrsSeksiCreationAttributes): Promise<PrsSeksi> {
    return await PrsSeksi.create(data);
  },

  async update(
    id: string,
    data: Partial<PrsSeksiAttributes>
  ): Promise<PrsSeksi | null> {
    const record = await PrsSeksi.findByPk(id);
    if (!record) return null;
    await record.update(data);
    return record;
  },

  async delete(id: string): Promise<boolean> {
    const deleted = await PrsSeksi.destroy({ where: { sek_id: id } });
    return deleted > 0;
  },

  // Cari seksi berdasarkan kode_bagian lewat relasi unit kerja

  async findByKodeBagian(kode_bagian: string) {
    const data = await PrsSeksi.findAll({
      attributes: ['kode', 'nama_sek'],
      include: [
        {
          model: PrsUnitKerja,
          as: 'unit_kerja',
          attributes: ['uk_id'],

          where: { kode_bagian },
        },
      ],
      order: [['kode', 'ASC']],
      raw: true,
      nest: false,
    });

    return data;
  },
};

export default PrsSeksiRepository;
