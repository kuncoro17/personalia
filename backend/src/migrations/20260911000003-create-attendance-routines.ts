import type { Migration } from '../types/migration';
import { attendanceRoutines } from './sql/attendance-routines';

const migration: Migration = {
  async up({ sequelize, transaction }) {
    for (const sql of attendanceRoutines) {
      await sequelize.query(sql, { transaction });
    }
  },

  async down() {
    throw new Error(
      'Baseline routine absensi tidak dapat di-rollback otomatis karena routine dapat sudah ada sebelum migration. Pulihkan definisi sebelumnya melalui migration baru.'
    );
  },
};

export default migration;
