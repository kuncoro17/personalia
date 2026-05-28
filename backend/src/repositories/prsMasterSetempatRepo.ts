import PrsMasterSetempat, {
  PrsMasterSetempatAttributes,
  PrsMasterSetempatCreationAttributes,
} from '../models/PrsMasterSetempat';

export class PrsMasterSetempatRepository {
  async findAll(): Promise<PrsMasterSetempat[]> {
    return await PrsMasterSetempat.findAll({
      order: [['id', 'ASC']],
    });
  }

  async findById(id: number): Promise<PrsMasterSetempat | null> {
    return await PrsMasterSetempat.findByPk(id);
  }

  async create(
    data: PrsMasterSetempatCreationAttributes
  ): Promise<PrsMasterSetempat> {
    return await PrsMasterSetempat.create(data);
  }

  async update(
    id: number,
    data: Partial<PrsMasterSetempatAttributes>
  ): Promise<PrsMasterSetempat | null> {
    const found = await PrsMasterSetempat.findByPk(id);
    if (!found) return null;
    return await found.update(data);
  }

  async delete(id: number): Promise<boolean> {
    const found = await PrsMasterSetempat.findByPk(id);
    if (!found) return false;
    await found.destroy();
    return true;
  }
}
