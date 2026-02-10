import PrsMasterProv, { ProvAttributes } from '../models/PrsMasterProv';
import { Optional } from 'sequelize';

export type ProvCreationAttributes = Optional<
  ProvAttributes,
  'id' | 'created_at' | 'updated_at'
>;

export class PrsMasterProvRepository {
  async findAll(): Promise<ProvAttributes[]> {
    return PrsMasterProv.findAll();
  }

  async findById(id: string): Promise<ProvAttributes | null> {
    return PrsMasterProv.findByPk(id);
  }

  async create(data: ProvCreationAttributes): Promise<ProvAttributes> {
    const instance = PrsMasterProv.build(data);
    return instance.save();
  }

  async update(
    id: string,
    data: Partial<ProvAttributes>
  ): Promise<ProvAttributes | null> {
    const record = await PrsMasterProv.findByPk(id);
    if (!record) return null;
    return record.update(data);
  }

  async delete(id: string): Promise<boolean> {
    const record = await PrsMasterProv.findByPk(id);
    if (!record) return false;
    await record.destroy();
    return true;
  }
}

export default new PrsMasterProvRepository();
