import { DataTypes, QueryTypes } from 'sequelize';

import type { Migration } from '../types/migration';

const TABLE_NAME = 'users';

const migration: Migration = {
  async up({ queryInterface, sequelize, transaction }) {
    const tableExists = await queryInterface.tableExists(TABLE_NAME, {
      transaction,
    });

    if (!tableExists) {
      await queryInterface.createTable(
        TABLE_NAME,
        {
          name: {
            type: DataTypes.STRING(255),
            allowNull: false,
          },
          email: {
            type: DataTypes.STRING(255),
            allowNull: false,
          },
          email_verified_at: {
            type: DataTypes.DATE,
            allowNull: true,
          },
          remember_token: {
            type: DataTypes.STRING(100),
            allowNull: true,
          },
          created_at: {
            type: DataTypes.DATE,
            allowNull: true,
          },
          updated_at: {
            type: DataTypes.DATE,
            allowNull: true,
          },
          id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
          },
        },
        { transaction }
      );
      return;
    }

    const table = await queryInterface.describeTable(TABLE_NAME);

    if (!('email_verified_at' in table)) {
      await queryInterface.addColumn(
        TABLE_NAME,
        'email_verified_at',
        {
          type: DataTypes.DATE,
          allowNull: true,
        },
        { transaction }
      );
    }

    if (!('remember_token' in table)) {
      await queryInterface.addColumn(
        TABLE_NAME,
        'remember_token',
        {
          type: DataTypes.STRING(100),
          allowNull: true,
        },
        { transaction }
      );
    }

    if ('name' in table && table.name.allowNull) {
      await sequelize.query(
        'UPDATE public.users SET name = email WHERE name IS NULL',
        { type: QueryTypes.UPDATE, transaction }
      );
      await queryInterface.changeColumn(
        TABLE_NAME,
        'name',
        {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        { transaction }
      );
    }

    for (const columnName of ['created_at', 'updated_at']) {
      if (!(columnName in table) || table[columnName].allowNull) continue;

      await queryInterface.changeColumn(
        TABLE_NAME,
        columnName,
        {
          type: DataTypes.DATE,
          allowNull: true,
        },
        { transaction }
      );
    }
  },

  async down({ queryInterface, transaction }) {
    const tableExists = await queryInterface.tableExists(TABLE_NAME, {
      transaction,
    });
    if (!tableExists) return;

    const table = await queryInterface.describeTable(TABLE_NAME);

    for (const columnName of ['remember_token', 'email_verified_at']) {
      if (!(columnName in table)) continue;
      await queryInterface.removeColumn(TABLE_NAME, columnName, {
        transaction,
      });
    }
  },
};

export default migration;
