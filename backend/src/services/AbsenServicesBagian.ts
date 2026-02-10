import { AbsensiRepository } from '../repositories/AbsensiRepository';
import { BadRequestException } from '../utils/http-exception';

export class AbsensiServiceBagian {
  private repo: AbsensiRepository;

  constructor() {
    this.repo = new AbsensiRepository();
  }

  async getPivot(
    start: string,
    end: string,
    unitType: string,
    unitKode: string | null
  ) {
    if (!start || !end) {
      throw new BadRequestException('Tanggal mulai dan akhir wajib diisi');
    }

    return await this.repo.getAbsensiPivotBagian(
      start,
      end,
      unitType,
      unitKode
    );
  }
}
