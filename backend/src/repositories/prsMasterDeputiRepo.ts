import {
  PrsMasterDeputi,
  PrsMasterDeputiAttributes,
  PrsMasterDeputiCreationAttributes,
} from '../models/PrsMasterDeputi';

const PrsMasterDeputiRepository = {
  async findAll(): Promise<PrsMasterDeputi[]> {
    try {
      return await PrsMasterDeputi.findAll({
        order: [['nama_dep', 'ASC']],
      });
    } catch {
      throw new Error('Gagal mengambil data deputi');
    }
  },

  async findById(id: string): Promise<PrsMasterDeputi | null> {
    try {
      return await PrsMasterDeputi.findByPk(id);
    } catch {
      throw new Error('Gagal mencari deputi berdasarkan ID');
    }
  },

  async create(
    data: PrsMasterDeputiCreationAttributes
  ): Promise<PrsMasterDeputi> {
    try {
      return await PrsMasterDeputi.create(data);
    } catch {
      throw new Error('Gagal membuat data deputi');
    }
  },

  async findByKode(kode: string): Promise<PrsMasterDeputi | null> {
    try {
      return await PrsMasterDeputi.findOne({ where: { kode } });
    } catch {
      throw new Error('Gagal mencari kode deputi');
    }
  },

  async update(
    id: string,
    data: Partial<PrsMasterDeputiAttributes>
  ): Promise<PrsMasterDeputi | null> {
    try {
      const record = await PrsMasterDeputi.findByPk(id);
      if (!record) return null;
      return await record.update(data);
    } catch {
      throw new Error('Gagal memperbarui data deputi');
    }
  },

  async delete(id: string): Promise<boolean | null> {
    try {
      const record = await PrsMasterDeputi.findByPk(id);
      if (!record) return null;
      await record.destroy();
      return true;
    } catch {
      throw new Error('Gagal menghapus data deputi');
    }
  },
};

export default PrsMasterDeputiRepository;
