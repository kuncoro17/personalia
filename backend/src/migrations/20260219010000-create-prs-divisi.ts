import { DataTypes } from 'sequelize';

import type { Migration } from '../types/migration';

const TABLE_NAME = 'prs_divisi';

const migration: Migration = {
  async up({ queryInterface, transaction }) {
    const exists = await queryInterface.tableExists(TABLE_NAME, {
      transaction,
    });
    if (exists) return;

    await queryInterface.createTable(
      TABLE_NAME,
      {
        div_id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        kode: {
          type: DataTypes.STRING(5),
          allowNull: false,
        },
        nama_div: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        alamat: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        created_at: {
          type: DataTypes.DATE,
        },
        updated_at: {
          type: DataTypes.DATE,
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
