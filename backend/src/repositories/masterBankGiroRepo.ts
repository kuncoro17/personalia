import MasterBankGiro, {
  MasterBankGiroAttributes,
  MasterBankGiroCreationAttributes,
} from '../models/MasterBankGiro';

export class MasterBankGiroRepository {
  async findAll(): Promise<MasterBankGiroAttributes[]> {
    return MasterBankGiro.findAll({
      order: [['bank_giro', 'ASC']],
      raw: true,
    });
  }

  async findById(
    id_bank_giro: string
  ): Promise<MasterBankGiroAttributes | null> {
    return MasterBankGiro.findByPk(id_bank_giro, { raw: true });
  }

  async create(
    data: MasterBankGiroCreationAttributes
  ): Promise<MasterBankGiroAttributes> {
    const instance = MasterBankGiro.build(data);
    const saved = await instance.save();
    return saved.get({ plain: true }) as MasterBankGiroAttributes;
  }

  async update(
    id_bank_giro: string,
    data: Partial<MasterBankGiroAttributes>
  ): Promise<MasterBankGiroAttributes | null> {
    const record = await MasterBankGiro.findByPk(id_bank_giro);
    if (!record) return null;
    const updated = await record.update(data);
    return updated.get({ plain: true }) as MasterBankGiroAttributes;
  }

  async delete(id_bank_giro: string): Promise<boolean> {
    const record = await MasterBankGiro.findByPk(id_bank_giro);
    if (!record) return false;
    await record.destroy();
    return true;
  }
}

export default new MasterBankGiroRepository();
