import dotenv from 'dotenv';
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { DataTypes, QueryTypes } from 'sequelize';
import type { Sequelize } from 'sequelize';

import logger from '../utils/logger';
import type { Migration, MigrationContext } from '../types/migration';

const loadEnv = (): void => {
  const candidates = [
    path.resolve(process.cwd(), '.env'),
    path.resolve(process.cwd(), '.env.local'),
    path.resolve(process.cwd(), 'backend/.env'),
    path.resolve(process.cwd(), 'backend/.env.local'),
    path.resolve(process.cwd(), 'backend/.env.staging'),
  ];

  for (const envPath of candidates) {
    dotenv.config({ path: envPath, quiet: true });
  }
};

loadEnv();

const MIGRATIONS_DIR = path.resolve(process.cwd(), 'src/migrations');
const MIGRATION_TABLE = 'schema_migrations';
let sequelizeRef: Sequelize;

type LoadedMigration = {
  file: string;
  name: string;
  migration: Migration;
};

const normalizeTableName = (table: unknown): string => {
  if (typeof table === 'string') return table;

  if (
    table &&
    typeof table === 'object' &&
    'tableName' in table &&
    typeof (table as { tableName?: unknown }).tableName === 'string'
  ) {
    return (table as { tableName: string }).tableName;
  }

  return '';
};

const ensureMigrationTable = async (): Promise<void> => {
  const queryInterface = sequelizeRef.getQueryInterface();
  const allTables = await queryInterface.showAllTables();
  const tableNames = allTables.map(normalizeTableName).filter(Boolean);

  if (tableNames.includes(MIGRATION_TABLE)) return;

  await queryInterface.createTable(MIGRATION_TABLE, {
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true,
    },
    executed_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });
};

const getMigrationFiles = async (): Promise<string[]> => {
  try {
    const entries = await fs.readdir(MIGRATIONS_DIR, { withFileTypes: true });

    return entries
      .filter(
        entry =>
          entry.isFile() &&
          (entry.name.endsWith('.ts') || entry.name.endsWith('.js')) &&
          !entry.name.endsWith('.d.ts')
      )
      .map(entry => entry.name)
      .sort((a, b) => a.localeCompare(b));
  } catch (error: unknown) {
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      (error as { code?: string }).code === 'ENOENT'
    ) {
      return [];
    }

    throw error;
  }
};

const isMigrationShape = (value: unknown): value is Migration =>
  typeof value === 'object' &&
  value !== null &&
  'up' in value &&
  typeof (value as { up?: unknown }).up === 'function';

const loadMigration = async (file: string): Promise<LoadedMigration> => {
  const absolutePath = path.join(MIGRATIONS_DIR, file);
  const moduleUrl = pathToFileURL(absolutePath).href;
  const imported = (await import(moduleUrl)) as {
    default?: unknown;
  };
  const candidate = imported.default ?? imported;

  if (!isMigrationShape(candidate)) {
    throw new Error(`Migration "${file}" tidak memiliki fungsi "up".`);
  }

  const baseName = file.replace(/\.(ts|js)$/i, '');
  return {
    file,
    name: candidate.name?.trim() || baseName,
    migration: candidate,
  };
};

const loadAllMigrations = async (): Promise<LoadedMigration[]> => {
  const files = await getMigrationFiles();
  const loaded: LoadedMigration[] = [];

  for (const file of files) {
    loaded.push(await loadMigration(file));
  }

  return loaded;
};

const getExecutedMigrationNames = async (): Promise<string[]> => {
  const quotedTable = `"${MIGRATION_TABLE.replace(/"/g, '""')}"`;
  const rows = await sequelizeRef.query<{ name: string }>(
    `SELECT name FROM ${quotedTable} ORDER BY name ASC`,
    {
      type: QueryTypes.SELECT,
    }
  );

  return rows.map(row => row.name);
};

const applyMigration = async (entry: LoadedMigration): Promise<void> => {
  const queryInterface = sequelizeRef.getQueryInterface();

  await sequelizeRef.transaction(async transaction => {
    const context: MigrationContext = {
      queryInterface,
      sequelize: sequelizeRef,
      transaction,
    };

    await entry.migration.up(context);

    await queryInterface.bulkInsert(
      MIGRATION_TABLE,
      [{ name: entry.name, executed_at: new Date() }],
      { transaction }
    );
  });
};

const rollbackMigration = async (entry: LoadedMigration): Promise<void> => {
  if (typeof entry.migration.down !== 'function') {
    throw new Error(
      `Migration "${entry.file}" tidak memiliki fungsi "down" untuk rollback.`
    );
  }

  const queryInterface = sequelizeRef.getQueryInterface();

  await sequelizeRef.transaction(async transaction => {
    const context: MigrationContext = {
      queryInterface,
      sequelize: sequelizeRef,
      transaction,
    };

    await entry.migration.down!(context);

    await queryInterface.bulkDelete(
      MIGRATION_TABLE,
      { name: entry.name },
      { transaction }
    );
  });
};

const commandUp = async (): Promise<void> => {
  const migrations = await loadAllMigrations();
  const executedNames = await getExecutedMigrationNames();
  const pending = migrations.filter(item => !executedNames.includes(item.name));

  if (pending.length === 0) {
    logger.info('Tidak ada migration pending.');
    return;
  }

  for (const item of pending) {
    logger.info({ migration: item.file }, 'Menjalankan migration');
    await applyMigration(item);
  }

  logger.info({ totalApplied: pending.length }, 'Migration selesai dijalankan');
};

const commandDown = async (): Promise<void> => {
  const migrations = await loadAllMigrations();
  const executedNames = await getExecutedMigrationNames();

  if (executedNames.length === 0) {
    logger.info('Tidak ada migration untuk di-rollback.');
    return;
  }

  const lastExecutedName = executedNames[executedNames.length - 1];
  const target = migrations.find(item => item.name === lastExecutedName);

  if (!target) {
    throw new Error(
      `Migration "${lastExecutedName}" tidak ditemukan di folder migrations.`
    );
  }

  logger.info({ migration: target.file }, 'Rollback migration');
  await rollbackMigration(target);
  logger.info('Rollback migration selesai');
};

const commandStatus = async (): Promise<void> => {
  const migrations = await loadAllMigrations();
  const executedNames = new Set(await getExecutedMigrationNames());

  if (migrations.length === 0) {
    logger.info('Belum ada file migration di src/migrations.');
    return;
  }

  for (const migration of migrations) {
    const status = executedNames.has(migration.name) ? '[UP]' : '[PENDING]';
    logger.info(`${status} ${migration.file}`);
  }
};

const run = async (): Promise<void> => {
  const command = (process.argv[2] || 'up').toLowerCase();

  const { sequelize } = await import('../config/database');
  sequelizeRef = sequelize;

  await sequelizeRef.authenticate();
  await ensureMigrationTable();

  if (command === 'up') {
    await commandUp();
    return;
  }

  if (command === 'down') {
    await commandDown();
    return;
  }

  if (command === 'status') {
    await commandStatus();
    return;
  }

  throw new Error(`Command migration tidak dikenal: ${command}`);
};

run()
  .then(async () => {
    await sequelizeRef.close();
    process.exit(0);
  })
  .catch(async error => {
    logger.error({ err: error }, 'Migration gagal dijalankan');
    if (sequelizeRef) {
      await sequelizeRef.close();
    }
    process.exit(1);
  });
