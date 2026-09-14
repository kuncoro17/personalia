import type { Migration } from '../types/migration';

// Baseline diambil dari metadata PostgreSQL yang sudah ada.
const migration: Migration = {
  async up({ sequelize, transaction }) {
    await sequelize.query(
      `CREATE TABLE IF NOT EXISTS public."sdm_checkinout_cuti" (
  "nik" character varying(20) NOT NULL,
  "tgl_cuti" date NOT NULL,
  "approval_date" date,
  "keperluan" character varying(255),
  "tipe" character varying(255),
  "tgl_insert" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  "flag_pump" smallint DEFAULT 0 NOT NULL,
  CONSTRAINT "sdm_checkinout_cuti_pkey" PRIMARY KEY (nik, tgl_cuti)
);
CREATE INDEX IF NOT EXISTS idx_cuti_nik_date ON public.sdm_checkinout_cuti USING btree (nik, tgl_cuti);`,
      { transaction }
    );
  },

  async down() {
    throw new Error(
      'Baseline sdm_checkinout_cuti tidak dapat di-rollback otomatis karena tabel dapat sudah ada sebelum migration. Gunakan migration baru untuk perubahan berikutnya.'
    );
  },
};

export default migration;
