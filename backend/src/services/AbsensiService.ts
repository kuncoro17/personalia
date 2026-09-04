// services/AbsensiService.ts
import { AbsensiRepository } from '../repositories/AbsensiRepository';

export class AbsensiService {
  private readonly repo: AbsensiRepository;

  constructor(repo: AbsensiRepository) {
    this.repo = repo;
  }

  async getPivot(startDate: string, endDate: string) {
    if (!startDate || !endDate) {
      throw new Error('Start date and end date are required');
    }

    return this.repo.getAbsensiPivot(startDate, endDate);
  }
}
