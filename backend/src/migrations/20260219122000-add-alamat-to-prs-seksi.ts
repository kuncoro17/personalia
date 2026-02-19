import { DataTypes } from 'sequelize';

import type { Migration } from '../types/migration';

const TABLE_NAME = 'prs_seksi';
const COLUMN_NAME = 'alamat';

const migration: Migration = {
  async up({ queryInterface, transaction }) {
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
    const table = await queryInterface.describeTable(TABLE_NAME);
    if (!(COLUMN_NAME in table)) return;

    await queryInterface.removeColumn(TABLE_NAME, COLUMN_NAME, { transaction });
  },
};

export default migration;
