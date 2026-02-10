import PrsKontrak from '../models/PrsKontrak';
import {
  CreateKontrakDTO,
  UpdateKontrakDTO,
} from '../services/prsKontrakService';

class PrsKontrakRepository {
  async findAll() {
    return PrsKontrak.findAll();
  }

  async findById(id: string) {
    return PrsKontrak.findByPk(id);
  }
  async create(data: CreateKontrakDTO) {
    const instance = PrsKontrak.build(data);
    return instance.save();
  }

  async update(id: string, data: UpdateKontrakDTO) {
    const record = await PrsKontrak.findByPk(id);
    if (!record) return null;
    return record.update(data);
  }
  async delete(id: string): Promise<boolean> {
    const record = await PrsKontrak.findByPk(id);
    if (!record) return false;
    await record.destroy();
    return true;
  }
}

export default new PrsKontrakRepository();
