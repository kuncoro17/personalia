import { QueryTypes } from 'sequelize';
import type { Migration } from '../types/migration';
import logger from '../utils/logger';
import { attendanceRoutines } from './sql/attendance-routines';

const migration: Migration = {
  async up({ sequelize, transaction }) {
    for (const routine of attendanceRoutines) {
      // Baseline: pertahankan routine production, termasuk return type dan grants.
      // Signature lengkap membedakan overload text dan varchar.
      const [existing] = await sequelize.query<{ exists: boolean }>(
        'SELECT to_regprocedure(:signature) IS NOT NULL AS "exists"',
        {
          replacements: { signature: routine.signature },
          type: QueryTypes.SELECT,
          transaction,
        }
      );

      if (existing.exists) {
        logger.info(
          { routine: routine.signature },
          'Routine sudah ada; baseline mempertahankan definisi database'
        );
        continue;
      }

      await sequelize.query(routine.sql, { transaction });
    }
  },

  async down() {
    throw new Error(
      'Baseline routine absensi tidak dapat di-rollback otomatis karena routine dapat sudah ada sebelum migration. Pulihkan definisi sebelumnya melalui migration baru.'
    );
  },
};

export default migration;
