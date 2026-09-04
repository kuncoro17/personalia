import PrsMasterKec from '../models/PrsMasterKec';

export interface KecInput {
  nama: string;
  kot_id: string;
  created_at?: Date;
  updated_at?: Date;
}

export class PrsMasterKecRepository {
  async findAll() {
    return PrsMasterKec.findAll({ order: [['nama', 'ASC']] });
  }

  async findById(id: string) {
    return PrsMasterKec.findByPk(id);
  }
  async findByKotId(kot_id: string) {
    return await PrsMasterKec.findAll({
      where: { kot_id },
    });
  }
  async create(data: Partial<KecInput>) {
    return await PrsMasterKec.create(data);
  }

  async update(id: string, data: Partial<KecInput>) {
    const kec = await PrsMasterKec.findByPk(id);
    if (!kec) return null;
    return kec.update(data);
  }

  async delete(id: string) {
    const kec = await PrsMasterKec.findByPk(id);
    if (!kec) return null;
    await kec.destroy();
    return true;
  }
}
