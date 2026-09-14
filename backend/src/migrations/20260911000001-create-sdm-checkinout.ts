import type { Migration } from '../types/migration';

// Baseline diambil dari metadata PostgreSQL yang sudah ada.
const migration: Migration = {
  async up({ sequelize, transaction }) {
    await sequelize.query(
      `CREATE TABLE IF NOT EXISTS public."sdm_checkinout" (
  "id" integer NOT NULL,
  "userid" character varying(20) NOT NULL,
  "checktime" timestamp without time zone NOT NULL,
  "checktype" character varying(1),
  "verifycode" integer DEFAULT 1,
  "sensorid" character varying(5),
  "memoinfo" character varying(30),
  "workcode" integer,
  "sn" character varying(20),
  "userextfmt" smallint,
  "employeename" character varying(40),
  "nik" character varying(191),
  "deptname" character varying(50),
  "usergroup" character varying(10),
  "machine" character varying(50),
  "created" timestamp without time zone,
  "createdby" character varying(10),
  "modified" timestamp without time zone,
  "modifiedby" character varying(10),
  "keterangan" text,
  "attachment" text,
  "tgl_insert" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);`,
      { transaction }
    );
  },

  async down() {
    throw new Error(
      'Baseline sdm_checkinout tidak dapat di-rollback otomatis karena tabel dapat sudah ada sebelum migration. Gunakan migration baru untuk perubahan berikutnya.'
    );
  },
};

export default migration;
