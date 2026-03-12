import { DataTypes } from 'sequelize';

import type { Migration } from '../types/migration';

const TABLE_NAME = 'prs_riw_pendidikan_kar';
const COLUMN_NAME = 'tingkat';
const DEFAULT_VALUE = 'UNKNOWN';

const migration: Migration = {
  async up({ queryInterface, sequelize, transaction }) {
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
    const table = await queryInterface.describeTable(TABLE_NAME);
    if (!(COLUMN_NAME in table)) return;

    await queryInterface.removeColumn(TABLE_NAME, COLUMN_NAME, { transaction });
  },
};

export default migration;
