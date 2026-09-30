import { attendanceRoutines } from './sql/attendance-routines';
import type { Migration } from '../types/migration';

const SIGNATURE =
  'public.get_absensi_pivot_bagian(date, date, text, text, refcursor)';

/**
 * Replaces the legacy pivot procedure that can fail with
 * `unrecognized format() type specifier` when PostgreSQL formats its dynamic SQL.
 */
const migration: Migration = {
  async up({ sequelize, transaction }) {
    const routine = attendanceRoutines.find(
      item => item.signature === SIGNATURE
    );

    if (!routine) {
      throw new Error(`Routine absensi tidak ditemukan: ${SIGNATURE}`);
    }

    await sequelize.query(routine.sql, { transaction });
  },

  async down() {
    throw new Error(
      'Rollback perbaikan procedure pivot harus memakai migration baru dengan definisi sebelumnya.'
    );
  },
};

export default migration;
