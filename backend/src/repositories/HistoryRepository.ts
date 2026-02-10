import History from '../models/HistoryModels';
import { HistoryAttributes, HistoryCreationAttributes } from '../types/history';

export default class HistoryRepository {
  async create(data: HistoryCreationAttributes) {
    return await History.create(data);
  }

  async update(id: string, data: Partial<HistoryAttributes>) {
    return await History.update(data, { where: { id_karyawan: id } });
  }

  async findAll() {
    return await History.findAll({ raw: true });
  }

  async findById(id: string) {
    return await History.findOne({ where: { id_karyawan: id }, raw: true });
  }

  async delete(id: string) {
    return await History.destroy({ where: { id_karyawan: id } });
  }
}
