import PrsMasterKot, {
  KotAttributes,
  KotCreationAttributes,
} from '../models/PrsMasterKot';

export class PrsMasterKotRepository {
  async findAll(): Promise<PrsMasterKot[]> {
    return await PrsMasterKot.findAll({ order: [['nama', 'ASC']] });
  }

  async findById(id: string): Promise<PrsMasterKot | null> {
    return await PrsMasterKot.findByPk(id);
  }
  async findByIdProv(prov_id: string): Promise<PrsMasterKot[] | null> {
    return await PrsMasterKot.findAll({
      where: { prov_id },
      order: [['nama', 'ASC']],
    });
  }

  async create(data: KotCreationAttributes): Promise<PrsMasterKot> {
    return await PrsMasterKot.create(data);
  }

  async update(
    id: string,
    data: Partial<KotAttributes>
  ): Promise<PrsMasterKot | null> {
    const found = await PrsMasterKot.findByPk(id);
    if (!found) return null;
    return await found.update(data);
  }

  async delete(id: string): Promise<boolean> {
    const found = await PrsMasterKot.findByPk(id);
    if (!found) return false;
    await found.destroy();
    return true;
  }
}
