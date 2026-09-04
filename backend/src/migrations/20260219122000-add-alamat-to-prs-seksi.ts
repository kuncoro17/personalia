import { DataTypes } from 'sequelize';

import type { Migration } from '../types/migration';

const TABLE_NAME = 'prs_seksi';
const COLUMN_NAME = 'alamat';

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
    if (!existingTables.has(TABLE_NAME)) return;

    const table = await queryInterface.describeTable(TABLE_NAME);
    if (COLUMN_NAME in table) return;

    await queryInterface.addColumn(
      TABLE_NAME,
      COLUMN_NAME,
      {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: '',
      },
      { transaction }
    );
  },

  async down({ queryInterface, transaction }) {
    const existingTables = new Set(
      (await queryInterface.showAllTables())
        .map(normalizeTableName)
        .filter(Boolean)
    );
    if (!existingTables.has(TABLE_NAME)) return;

    const table = await queryInterface.describeTable(TABLE_NAME);
    if (!(COLUMN_NAME in table)) return;

    await queryInterface.removeColumn(TABLE_NAME, COLUMN_NAME, { transaction });
  },
};

export default migration;
