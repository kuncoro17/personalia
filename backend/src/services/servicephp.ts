import { QueryTypes } from 'sequelize';

import { sequelize } from '../config/database';

export interface PresensiRecord {
  tanggal: string;
  nik: string;
  employeename: string;
  jamMasuk: string;
  jamPulang: string;
}
export interface PresensiResponse {
  success: true;
  data: PresensiRecord[];
}

export class PresensiService {
  static async getLatest(userid: string): Promise<PresensiResponse> {
    const normalizedUserId = userid.trim();

    const data = await sequelize.query<PresensiRecord>(
      `SELECT TO_CHAR(checktime::date, 'YYYY-MM-DD') AS tanggal,
              COALESCE(MAX(nik), '') AS nik,
              COALESCE(MAX(employeename), '') AS employeename,
              TO_CHAR(MIN(checktime), 'HH24:MI:SS') AS "jamMasuk",
              TO_CHAR(MAX(checktime), 'HH24:MI:SS') AS "jamPulang"
         FROM public.sdm_checkinout
        WHERE userid = $userid
        GROUP BY checktime::date
        ORDER BY checktime::date DESC
        LIMIT 14`,
      {
        bind: { userid: normalizedUserId },
        type: QueryTypes.SELECT,
      }
    );

    return { success: true, data };
  }
}
