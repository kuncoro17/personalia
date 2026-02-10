import HistoryRepository from '../repositories/HistoryRepository';
import { HistoryCreationAttributes } from '../models/HistoryModels';
export default class History2Service {
  historyRepo: HistoryRepository;

  constructor() {
    this.historyRepo = new HistoryRepository();
  }

  async createHistory(payload: HistoryCreationAttributes) {
    return await this.historyRepo.create(payload);
  }

  async getAllHistory() {
    return await this.historyRepo.findAll();
  }

  async getHistoryById(id: string) {
    return await this.historyRepo.findById(id);
  }

  async updateHistory(id: string, payload: HistoryCreationAttributes) {
    return await this.historyRepo.update(id, payload);
  }

  async deleteHistory(id: string) {
    return await this.historyRepo.delete(id);
  }
}
