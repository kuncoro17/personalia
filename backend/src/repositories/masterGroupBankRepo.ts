import MasterGroupBank, {
  MasterGroupBankAttributes,
  MasterGroupBankCreationAttributes,
} from '../models/MasterGroupBank';

export class MasterGroupBankRepository {
  async findAll(): Promise<MasterGroupBankAttributes[]> {
    return MasterGroupBank.findAll({
      order: [['group_bank', 'ASC']],
      raw: true,
    });
  }

  async findById(id: string): Promise<MasterGroupBankAttributes | null> {
    return MasterGroupBank.findByPk(id, { raw: true });
  }

  async create(
    data: MasterGroupBankCreationAttributes
  ): Promise<MasterGroupBankAttributes> {
    const instance = MasterGroupBank.build(data);
    const saved = await instance.save();
    return saved.get({ plain: true }) as MasterGroupBankAttributes;
  }

  async update(
    id: string,
    data: Partial<MasterGroupBankAttributes>
  ): Promise<MasterGroupBankAttributes | null> {
    const record = await MasterGroupBank.findByPk(id);
    if (!record) return null;
    const updated = await record.update(data);
    return updated.get({ plain: true }) as MasterGroupBankAttributes;
  }

  async delete(id: string): Promise<boolean> {
    const record = await MasterGroupBank.findByPk(id);
    if (!record) return false;
    await record.destroy();
    return true;
  }
}

export default new MasterGroupBankRepository();
