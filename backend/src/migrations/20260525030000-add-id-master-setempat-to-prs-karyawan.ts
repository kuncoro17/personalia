import { DataTypes } from 'sequelize';

import type { Migration } from '../types/migration';

const TABLE_NAME = 'prs_karyawan';
const COLUMN_NAME = 'id_master_setempat';

const migration: Migration = {
  async up({ queryInterface, transaction }) {
    const exists = await queryInterface.tableExists(TABLE_NAME, {
      transaction,
    });
    if (!exists) return;

    const table = await queryInterface.describeTable(TABLE_NAME);
    if (COLUMN_NAME in table) return;

    await queryInterface.addColumn(
      TABLE_NAME,
      COLUMN_NAME,
      {
        type: DataTypes.INTEGER,
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

    await queryInterface.removeColumn(TABLE_NAME, COLUMN_NAME, { transaction });
  },
};

export default migration;
