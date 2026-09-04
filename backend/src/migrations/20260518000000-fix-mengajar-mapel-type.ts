import type { Migration } from '../types/migration';

const TABLE_NAME = 'prs_jam_mengajar_karyawan';
const COLUMN_NAME = 'mengajar_mapel';

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

const quoteIdent = (value: string): string => `"${value.replace(/"/g, '""')}"`;

const migration: Migration = {
  async up({ queryInterface, sequelize, transaction }) {
    const existingTables = new Set(
      (await queryInterface.showAllTables())
        .map(normalizeTableName)
        .filter(Boolean)
    );
    if (!existingTables.has(TABLE_NAME)) return;

    const table = await queryInterface.describeTable(TABLE_NAME);
    if (!(COLUMN_NAME in table)) return;

    const quotedTable = quoteIdent(TABLE_NAME);
    const quotedColumn = quoteIdent(COLUMN_NAME);

    // Ensure the column can be converted from string to UUID safely.
    await sequelize.query(
      `ALTER TABLE ${quotedTable}
       ALTER COLUMN ${quotedColumn} DROP NOT NULL`,
      { transaction }
    );

    await sequelize.query(
      `ALTER TABLE ${quotedTable}
       ALTER COLUMN ${quotedColumn} TYPE uuid
       USING NULLIF(${quotedColumn}::text, '')::uuid`,
      { transaction }
    );
  },

  async down({ queryInterface, sequelize, transaction }) {
    const existingTables = new Set(
      (await queryInterface.showAllTables())
        .map(normalizeTableName)
        .filter(Boolean)
    );
    if (!existingTables.has(TABLE_NAME)) return;

    const table = await queryInterface.describeTable(TABLE_NAME);
    if (!(COLUMN_NAME in table)) return;

    const quotedTable = quoteIdent(TABLE_NAME);
    const quotedColumn = quoteIdent(COLUMN_NAME);

    // Revert back to previous Sequelize-created type (string).
    await sequelize.query(
      `ALTER TABLE ${quotedTable}
       ALTER COLUMN ${quotedColumn} TYPE varchar(40)
       USING COALESCE(${quotedColumn}::text, '')`,
      { transaction }
    );

    await sequelize.query(
      `ALTER TABLE ${quotedTable}
       ALTER COLUMN ${quotedColumn} SET NOT NULL`,
      { transaction }
    );
  },
};

export default migration;
