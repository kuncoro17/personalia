import type { Migration } from '../types/migration';

/**
 * Replaces the legacy procedure still called by older consumers. Its prior
 * dynamic SQL referenced `ukk.jabatan`, a column that does not exist.
 */
const migration: Migration = {
  async up({ sequelize, transaction }) {
    await sequelize.query(
      `CREATE OR REPLACE PROCEDURE public.get_absensi_pivot_1(
          IN p_start date,
          IN p_end date,
          INOUT ref refcursor DEFAULT 'absensi_cursor'
        )
        LANGUAGE plpgsql
        AS $procedure$
        BEGIN
          CALL public.get_absensi_pivot_bagian(
            p_start,
            p_end,
            'BAGIAN',
            NULL,
            ref
          );
        END;
        $procedure$`,
      { transaction }
    );
  },

  async down() {
    throw new Error(
      'Rollback function pivot harus memakai migration baru dengan definisi sebelumnya.'
    );
  },
};

export default migration;
