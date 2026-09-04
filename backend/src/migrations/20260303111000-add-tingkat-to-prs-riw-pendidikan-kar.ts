import { DataTypes } from 'sequelize';

import type { Migration } from '../types/migration';

const TABLE_NAME = 'prs_riw_pendidikan_kar';
const COLUMN_NAME = 'tingkat';
const DEFAULT_VALUE = 'UNKNOWN';

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
  async up({ queryInterface, sequelize, transaction }) {
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
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      { transaction }
    );

    await sequelize.query(
      `UPDATE "${TABLE_NAME}" SET "${COLUMN_NAME}" = :defaultValue WHERE "${COLUMN_NAME}" IS NULL`,
      { transaction, replacements: { defaultValue: DEFAULT_VALUE } }
    );

    await queryInterface.changeColumn(
      TABLE_NAME,
      COLUMN_NAME,
      {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: DEFAULT_VALUE,
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
