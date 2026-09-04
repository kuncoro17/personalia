import { QueryTypes } from 'sequelize';

import type { Migration } from '../types/migration';

const TABLE_NAME = 'prs_master_agama';

const quoteIdent = (value: string): string => `"${value.replace(/"/g, '""')}"`;

const SEED_ROWS: Array<{ kode_agama: number; agama: string }> = [
  { kode_agama: 1, agama: 'Islam' },
  { kode_agama: 2, agama: 'Kristen' },
  { kode_agama: 3, agama: 'Katolik' },
  { kode_agama: 4, agama: 'Hindu' },
  { kode_agama: 5, agama: 'Buddha' },
  { kode_agama: 6, agama: 'Konghucu' },
];

const migration: Migration = {
  async up({ queryInterface, sequelize, transaction }) {
    const exists = await queryInterface.tableExists(TABLE_NAME, {
      transaction,
    });
    if (!exists) return;

    const quotedTable = quoteIdent(TABLE_NAME);
    const countRows = await sequelize.query<{ count: string }>(
      `SELECT COUNT(*)::text as count FROM ${quotedTable}`,
      { type: QueryTypes.SELECT, transaction }
    );

    if (countRows.length > 0 && Number(countRows[0].count) > 0) return;

    const now = new Date();
    await queryInterface.bulkInsert(
      TABLE_NAME,
      SEED_ROWS.map(row => ({
        ...row,
        created_at: now,
        updated_at: now,
      })),
      { transaction }
    );
  },

  async down({ queryInterface, transaction }) {
    const exists = await queryInterface.tableExists(TABLE_NAME, {
      transaction,
    });
    if (!exists) return;

    await queryInterface.bulkDelete(
      TABLE_NAME,
      {
        kode_agama: SEED_ROWS.map(row => row.kode_agama),
        agama: SEED_ROWS.map(row => row.agama),
      },
      { transaction }
    );
  },
};

export default migration;
