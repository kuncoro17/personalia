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
    try {
      const result = await sequelize.query(
        `CALL get_absensi_pivot_bagian(:start, :end, :unitType, :unitKode, 'absensi_cursor'); FETCH ALL FROM absensi_cursor;`,
        {
          replacements: { start, end, unitType, unitKode },
          model: AbsensiPivot, // pakai model
          mapToModel: true, // hasil langsung map ke AbsensiPivot
          type: QueryTypes.SELECT,
        }
      );

      return result as AbsensiPivot[];
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new Error(`Repository error: ${err.message}`);
      }
      throw new Error('Repository error: Unknown error');
    }
  }
}
