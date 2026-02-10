// repositories/lemburRepository.ts
import { sequelize } from '../config/database';
import { TransaksiLemburDetail } from '../models/TransaksiLemburDetail';
import { LemburRow } from '../types/AbsensiTypes';

export class LemburRepository {
  async getByRange(start: string, end: string): Promise<LemburRow[]> {
    const data = await TransaksiLemburDetail.findAll({
      where: sequelize.literal(
        `TO_DATE("tgl", 'DD/MM/YYYY') BETWEEN '${start}' AND '${end}'`
      ),
      raw: true,
    });

    return data as unknown as LemburRow[];
  }
}
