/* eslint-disable no-unused-vars */
import type { QueryInterface, Sequelize, Transaction } from 'sequelize';

export type MigrationContext = {
  queryInterface: QueryInterface;
  sequelize: Sequelize;
  transaction: Transaction;
};

export type Migration = {
  name?: string;
  up: (ctx: MigrationContext) => Promise<void>;
  down?: (ctx: MigrationContext) => Promise<void>;
};
