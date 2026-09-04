import { DataTypes } from 'sequelize';

import type { Migration } from '../types/migration';

const TABLE_NAME = 'app_logs';

const auditColumns = {
  action: { type: DataTypes.STRING(20), allowNull: true },
  http_method: { type: DataTypes.STRING(10), allowNull: true },
  path: { type: DataTypes.TEXT, allowNull: true },
  status_code: { type: DataTypes.INTEGER, allowNull: true },
  actor_id: { type: DataTypes.STRING(255), allowNull: true },
  actor_email: { type: DataTypes.STRING(320), allowNull: true },
  actor_name: { type: DataTypes.STRING(255), allowNull: true },
  auth_source: { type: DataTypes.STRING(50), allowNull: true },
};

const migration: Migration = {
  async up({ queryInterface, transaction }) {
    const exists = await queryInterface.tableExists(TABLE_NAME, {
      transaction,
    });

    if (!exists) {
      await queryInterface.createTable(
        TABLE_NAME,
        {
          id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
          },
          level: { type: DataTypes.STRING, allowNull: false },
          message: { type: DataTypes.TEXT, allowNull: false },
          error: { type: DataTypes.TEXT, allowNull: true },
          response_time_ms: { type: DataTypes.INTEGER, allowNull: true },
          ...auditColumns,
          created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
          },
        },
        { transaction }
      );
      return;
    }

    const table = await queryInterface.describeTable(TABLE_NAME);
    for (const [columnName, definition] of Object.entries(auditColumns)) {
      if (!(columnName in table)) {
        await queryInterface.addColumn(TABLE_NAME, columnName, definition, {
          transaction,
        });
      }
    }
  },

  async down({ queryInterface, transaction }) {
    const exists = await queryInterface.tableExists(TABLE_NAME, {
      transaction,
    });
    if (!exists) return;

    const table = await queryInterface.describeTable(TABLE_NAME);
    for (const columnName of Object.keys(auditColumns).reverse()) {
      if (columnName in table) {
        await queryInterface.removeColumn(TABLE_NAME, columnName, {
          transaction,
        });
      }
    }
  },
};

export default migration;
