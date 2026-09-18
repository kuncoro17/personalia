import { DataTypes } from 'sequelize';

import type { Migration } from '../types/migration';

const TABLE_NAME = 'prs_karyawan';
const COLUMN_NAME = 'tempat_lahir';

const migration: Migration = {
  async up({ queryInterface, transaction }) {
    const exists = await queryInterface.tableExists(TABLE_NAME, {
      transaction,
    });
    if (!exists) return;

    const table = await queryInterface.describeTable(TABLE_NAME);
    if (!(COLUMN_NAME in table)) return;

    await queryInterface.changeColumn(
      TABLE_NAME,
      COLUMN_NAME,
      {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      { transaction }
    );
  },

  async down({ queryInterface, transaction }) {
    const exists = await queryInterface.tableExists(TABLE_NAME, {
      transaction,
    });
    if (!exists) return;

    const table = await queryInterface.describeTable(TABLE_NAME);
    if (!(COLUMN_NAME in table)) return;

    await queryInterface.changeColumn(
      TABLE_NAME,
      COLUMN_NAME,
      {
        type: DataTypes.UUID,
        allowNull: true,
      },
      { transaction }
    );
  },
};

export default migration;
