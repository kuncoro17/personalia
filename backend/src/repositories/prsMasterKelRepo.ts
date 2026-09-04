import PrsMasterKel, { KelCreationAttributes } from '../models/PrsMasterKel';

export class PrsMasterKelRepository {
  async findAll() {
    return await PrsMasterKel.findAll({ order: [['nama', 'ASC']] });
  }

  async findById(id: string) {
    return await PrsMasterKel.findByPk(id);
  }

  async findByKecId(kec_id: string) {
    return await PrsMasterKel.findAll({
      where: { kec_id },
    });
  }
  async create(data: KelCreationAttributes) {
    return await PrsMasterKel.create(data);
  }

  async update(id: string, data: Partial<KelCreationAttributes>) {
    const record = await PrsMasterKel.findByPk(id);
    if (!record) return null;
    return await record.update(data);
  }

  async delete(id: string) {
    const kel = await PrsMasterKel.findByPk(id);
    if (!kel) return null;
    await kel.destroy();
    return true;
  }
}
