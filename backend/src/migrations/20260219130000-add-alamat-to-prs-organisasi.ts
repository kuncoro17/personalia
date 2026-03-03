import { DataTypes } from 'sequelize';

import type { Migration } from '../types/migration';

const COLUMN_NAME = 'alamat';
const TARGET_TABLES = [
  'prs_bagian',
  'prs_divisi',
  'prs_deputi',
  'prs_direktur',
];

const migration: Migration = {
  async up({ queryInterface, transaction }) {
    for (const tableName of TARGET_TABLES) {
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
    for (const tableName of TARGET_TABLES) {
      const table = await queryInterface.describeTable(tableName);
      if (!(COLUMN_NAME in table)) continue;

      await queryInterface.removeColumn(tableName, COLUMN_NAME, {
        transaction,
      });
    }
  },
};

export default migration;
