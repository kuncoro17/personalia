import { DataTypes } from 'sequelize';

import type { Migration } from '../types/migration';

const COLUMN_NAME = 'alamat';
const TARGET_TABLES = [
  'prs_bagian',
  'prs_divisi',
  'prs_deputi',
  'prs_direktur',
];

const normalizeTableName = (table: unknown): string => {
  if (typeof table === 'string') return table;

  if (
    table &&
    typeof table === 'object' &&
    'tableName' in table &&
    typeof (table as { tableName?: unknown }).tableName === 'string'
  ) {
    return (table as { tableName: string }).tableName;
  }

  return '';
};

const migration: Migration = {
  async up({ queryInterface, transaction }) {
    const existingTables = new Set(
      (await queryInterface.showAllTables())
        .map(normalizeTableName)
        .filter(Boolean)
    );

    for (const tableName of TARGET_TABLES) {
      if (!existingTables.has(tableName)) continue;

      const table = await queryInterface.describeTable(tableName);
      if (COLUMN_NAME in table) continue;

      await queryInterface.addColumn(
        tableName,
        COLUMN_NAME,
        {
          type: DataTypes.STRING(255),
          allowNull: false,
          defaultValue: '',
        },
        { transaction }
      );
    }
  },

  async down({ queryInterface, transaction }) {
    const existingTables = new Set(
      (await queryInterface.showAllTables())
        .map(normalizeTableName)
        .filter(Boolean)
    );

    for (const tableName of TARGET_TABLES) {
      if (!existingTables.has(tableName)) continue;

      const table = await queryInterface.describeTable(tableName);
      if (!(COLUMN_NAME in table)) continue;

      await queryInterface.removeColumn(tableName, COLUMN_NAME, {
        transaction,
      });
    }
  },
};

export default migration;
