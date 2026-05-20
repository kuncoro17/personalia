import { sequelize } from '../config/database';
import { logInfo } from '../utils/log.helper';
import { AbsensiPivotRow } from '../types/AbsensiPivot';
import { QueryTypes, Transaction } from 'sequelize';
import AbsensiPivot from '../models/AbsensiModelBagian';
export class AbsensiRepository {
  async getAbsensiPivot(
    startDate: string,
    endDate: string
  ): Promise<AbsensiPivotRow[]> {
    logInfo(`Memanggil repository getAbsensiPivot: ${startDate} - ${endDate}`);

    return await sequelize.transaction(async (t: Transaction) => {
      const refCursor = 'absensi_cursor';

      // 1. Panggil procedure
      await sequelize.query('CALL get_absensi_pivot(:start, :end, :cursor)', {
        replacements: { start: startDate, end: endDate, cursor: refCursor },
        transaction: t,
      });

      // 2. Ambil semua data dari cursor
      const rows = await sequelize.query<AbsensiPivotRow>(
        `FETCH ALL FROM ${refCursor}`,
        {
          type: QueryTypes.SELECT, // penting untuk TS
          transaction: t,
        }
      );

      logInfo(`Repository getAbsensiPivot selesai, jumlah row: ${rows.length}`);

      return rows;
    });
  }

  async getAbsensiPivotBagian(
    start: string,
    end: string,
    unitType: string = 'BAGIAN',
    unitKode: string | null = null
  ): Promise<AbsensiPivot[]> {
    logInfo(
      `Memanggil repository getAbsensiPivotBagian: ${start} - ${end} (${unitType}${unitKode ? `:${unitKode}` : ''})`
    );

    return await sequelize.transaction(async (t: Transaction) => {
      const refCursor = 'absensi_cursor';

      await sequelize.query(
        'CALL get_absensi_pivot_bagian(:start, :end, :unitType, :unitKode, :cursor)',
        {
          replacements: {
            start,
            end,
            unitType,
            unitKode,
            cursor: refCursor,
          },
          transaction: t,
        }
      );

      const rows = await sequelize.query<AbsensiPivot>(
        `FETCH ALL FROM ${refCursor}`,
        {
          model: AbsensiPivot,
          mapToModel: true,
          type: QueryTypes.SELECT,
          transaction: t,
        }
      );

      return rows as AbsensiPivot[];
    });
  }
}
