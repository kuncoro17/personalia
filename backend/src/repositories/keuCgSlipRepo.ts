import {
  KeuCgSlip,
  KeuCgSlipAttributes,
  KeuCgSlipCreationAttributes,
} from '../models/KeuCgSlip';

const KeuCgSlipRepository = {
  async findAll(): Promise<KeuCgSlip[]> {
    return await KeuCgSlip.findAll({
      order: [['id', 'DESC']],
    });
  },

  async findById(id: number): Promise<KeuCgSlip | null> {
    return await KeuCgSlip.findByPk(id);
  },

  async create(data: KeuCgSlipCreationAttributes): Promise<KeuCgSlip> {
    return await KeuCgSlip.create(data);
  },

  async update(
    id: number,
    data: Partial<KeuCgSlipAttributes>
  ): Promise<KeuCgSlip | null> {
    const record = await KeuCgSlip.findByPk(id);
    if (!record) return null;
    return await record.update(data);
  },

  async delete(id: number): Promise<boolean | null> {
    const record = await KeuCgSlip.findByPk(id);
    if (!record) return null;
    await record.destroy();
    return true;
  },
};

export default KeuCgSlipRepository;
