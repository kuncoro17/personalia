import { QueryTypes } from 'sequelize';

import type { Migration } from '../types/migration';
import { attendanceRoutines } from './sql/attendance-routines';

const unitJoins = `LEFT JOIN prs_divisi d ON d.kode = uk.kode_divisi
        LEFT JOIN prs_bagian b ON b.kode = uk.kode_bagian
        LEFT JOIN prs_seksi s ON s.kode = uk.kode_seksi
        LEFT JOIN prs_deputi dp ON dp.kode = uk.kode_deputi
        LEFT JOIN prs_direktur dr ON dr.kode = uk.kode_direktur`;

const unitConditions = `OR (%L = 'BAGIAN' AND b.kode = %L)
               OR (%L = 'DIVISI' AND d.kode = %L)
               OR (%L = 'SEKSI' AND s.kode = %L)
               OR (%L = 'DEPUTI' AND dp.kode = %L)
               OR (%L = 'DIREKTUR' AND dr.kode = %L)`;

const migration: Migration = {
  async up({ sequelize, transaction }) {
    const routine = attendanceRoutines.find(item =>
      item.signature.includes('get_absensi_pivot_bagian(date, date, text')
    );

    if (!routine) {
      throw new Error('Routine get_absensi_pivot_bagian text tidak ditemukan');
    }

    const sql = routine.sql
      .replace(
        `LEFT JOIN prs_divisi d ON d.kode = uk.kode_divisi
        LEFT JOIN prs_bagian b ON b.kode = uk.kode_bagian`,
        unitJoins
      )
      .replace(
        `OR (%L = 'BAGIAN' AND b.kode = %L)
               OR (%L = 'DIVISI' AND d.kode = %L))`,
        `${unitConditions})`
      )
      .replace(
        `d.nama_div,
            b.nama_bag,

            %s,`,
        `dr.nama_dir AS nama_direktur,
            dp.nama_dep AS nama_deputi,
            d.nama_div,
            b.nama_bag,

            %s,`
      )
      .replace(
        `GROUP BY kt.nik, kt.nama_lengkap, d.nama_div, b.nama_bag, j.jabatan`,
        `GROUP BY kt.nik, kt.nama_lengkap, dr.nama_dir, dp.nama_dep, d.nama_div, b.nama_bag, j.jabatan`
      )
      .replace(
        `p_unit_type, p_unit_kode,
        p_unit_type, p_unit_kode`,
        `p_unit_type, p_unit_kode,
        p_unit_type, p_unit_kode,
        p_unit_type, p_unit_kode,
        p_unit_type, p_unit_kode,
        p_unit_type, p_unit_kode`
      );

    await sequelize.query(sql, { type: QueryTypes.RAW, transaction });
  },

  async down() {
    throw new Error(
      'Pulihkan routine absensi melalui migration baru jika diperlukan'
    );
  },
};

export default migration;
