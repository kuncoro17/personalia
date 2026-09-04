import { DataTypes } from 'sequelize';

import type { Migration } from '../types/migration';

const TABLE_NAME = 'prs_master_setempat';

const migration: Migration = {
  async up({ queryInterface, transaction }) {
    const exists = await queryInterface.tableExists(TABLE_NAME, {
      transaction,
    });
    if (exists) return;

    await queryInterface.createTable(
      TABLE_NAME,
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        kota_setempat: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        created_at: {
          type: DataTypes.DATE,
        },
        updated_at: {
          type: DataTypes.DATE,
        },
        deleted_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },
      },
      { transaction }
    );
  },

  async down({ queryInterface, transaction }) {
    const exists = await queryInterface.tableExists(TABLE_NAME, {
      transaction,
    });
    if (!exists) return;

    await queryInterface.dropTable(TABLE_NAME, { transaction });
  },
};

export default migration;
