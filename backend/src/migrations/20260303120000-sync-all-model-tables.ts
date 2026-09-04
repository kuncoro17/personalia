import { DataTypes, QueryTypes } from 'sequelize';
import type { Model, ModelStatic, Sequelize, Transaction } from 'sequelize';
import { randomUUID } from 'crypto';

import AppLog from '../models/AppLog';
import HistoryModels from '../models/HistoryModels';
import PrsBagian from '../models/PrsBagian';
import PrsDivisi from '../models/PrsDivisi';
import PrsKaryawanModel from '../models/PrsKaryawanModel';
import PrsKeluargaKaryawan from '../models/PrsKeluargaKaryawan';
import PrsKontrak from '../models/PrsKontrak';
import PrsMasterAgama from '../models/PrsMasterAgama';
import PrsMasterAlamat from '../models/PrsMasterAlamat';
import PrsMasterDeputi from '../models/PrsMasterDeputi';
import PrsMasterDirektur from '../models/PrsMasterDirektur';
import PrsMasterKec from '../models/PrsMasterKec';
import PrsMasterKel from '../models/PrsMasterKel';
import PrsMasterKot from '../models/PrsMasterKot';
import PrsMasterMapel from '../models/PrsMasterMapel';
import PrsMasterProv from '../models/PrsMasterProv';
import PrsMasterRiwPendidikan from '../models/PrsMasterRiwPendidikan';
import PrsPengalamanKerja from '../models/PrsPengalamanKerja';
import PrsRiwPendidikanKar from '../models/PrsRiwPendidikanKar';
import PrsSeksi from '../models/PrsSeksi';
import PrsStatusKaryawan from '../models/PrsStatusKaryawan';
import PrsUnitKerja from '../models/PrsUnitKerja';
import PrsUnitKerjaKaryawan from '../models/PrsUnitKerjaKaryawan';
import { TransaksiLemburDetail } from '../models/TransaksiLemburDetail';
import prsDokumenModel from '../models/prsDokumenModel';
import prsJabatan from '../models/prsJabatan';
import prsJamMengajarKaryawan from '../models/prsJamMengajarKaryawan';
import prsKontakDarurat from '../models/prsKontakDarurat';
import prsTipeDokumenModel from '../models/prsTipeDokumenModel';
import userModel from '../models/userModel';
import type { Migration } from '../types/migration';

type SyncModel = ModelStatic<Model>;

type AttributeLike = {
  field?: string;
  fieldName?: string;
  type: unknown;
  allowNull?: boolean;
  defaultValue?: unknown;
  primaryKey?: boolean;
  autoIncrement?: boolean;
  unique?: unknown;
  references?: unknown;
  onDelete?: string;
  onUpdate?: string;
  comment?: string;
};

type ColumnDefinition = Record<string, unknown> & {
  type: unknown;
  allowNull?: boolean;
  defaultValue?: unknown;
};

const MODELS: SyncModel[] = [
  AppLog,
  HistoryModels,
  PrsBagian,
  PrsDivisi,
  PrsKaryawanModel,
  PrsKeluargaKaryawan,
  PrsKontrak,
  PrsMasterAgama,
  PrsMasterAlamat,
  PrsMasterDeputi,
  PrsMasterDirektur,
  PrsMasterKec,
  PrsMasterKel,
  PrsMasterKot,
  PrsMasterMapel,
  PrsMasterProv,
  PrsMasterRiwPendidikan,
  PrsPengalamanKerja,
  PrsRiwPendidikanKar,
  PrsSeksi,
  PrsStatusKaryawan,
  PrsUnitKerja,
  PrsUnitKerjaKaryawan,
  TransaksiLemburDetail,
  prsJabatan,
  prsJamMengajarKaryawan,
  prsKontakDarurat,
  prsTipeDokumenModel,
  prsDokumenModel,
  userModel,
];

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

const quoteIdent = (value: string): string => `"${value.replace(/"/g, '""')}"`;

const quoteQualifiedTable = (tableName: string): string =>
  tableName
    .split('.')
    .filter(Boolean)
    .map(part => quoteIdent(part.trim()))
    .join('.');

const tableHasRows = async (
  sequelize: Sequelize,
  tableName: string,
  transaction: Transaction
): Promise<boolean> => {
  const quotedTable = quoteQualifiedTable(tableName);
  const rows = await sequelize.query<{ exists: number }>(
    `SELECT 1 as exists FROM ${quotedTable} LIMIT 1`,
    { type: QueryTypes.SELECT, transaction }
  );

  return rows.length > 0;
};

const ensureDefaultTipeDokumenId = async (
  sequelize: Sequelize,
  transaction: Transaction
): Promise<string> => {
  const existing = await sequelize.query<{ id: string }>(
    `SELECT id FROM ${quoteQualifiedTable('prs_tipe_dokumen')}
     WHERE tipe_dokumen IN ('LAINNYA', 'UNKNOWN', 'Tidak Diketahui')
     ORDER BY tipe_dokumen ASC
     LIMIT 1`,
    { type: QueryTypes.SELECT, transaction }
  );

  if (existing.length > 0) return existing[0].id;

  const id = randomUUID();
  await sequelize.query(
    `INSERT INTO ${quoteQualifiedTable('prs_tipe_dokumen')}
      (id, tipe_dokumen, created_at, updated_at)
     VALUES
      (:id, :tipe, NOW(), NOW())`,
    {
      type: QueryTypes.INSERT,
      transaction,
      replacements: { id, tipe: 'LAINNYA' },
    }
  );

  return id;
};

const buildColumnDefinition = (attribute: AttributeLike): ColumnDefinition => {
  const column: ColumnDefinition = {
    type: attribute.type,
  };

  if (attribute.allowNull !== undefined) column.allowNull = attribute.allowNull;
  if (attribute.defaultValue !== undefined)
    column.defaultValue = attribute.defaultValue;
  if (attribute.primaryKey !== undefined)
    column.primaryKey = attribute.primaryKey;
  if (attribute.autoIncrement !== undefined)
    column.autoIncrement = attribute.autoIncrement;
  if (attribute.unique !== undefined) column.unique = attribute.unique;
  if (attribute.references !== undefined)
    column.references = attribute.references;
  if (attribute.onDelete !== undefined) column.onDelete = attribute.onDelete;
  if (attribute.onUpdate !== undefined) column.onUpdate = attribute.onUpdate;
  if (attribute.comment !== undefined) column.comment = attribute.comment;

  return column;
};

const getModelColumns = (
  model: SyncModel
): Record<string, ColumnDefinition> => {
  const attributes = model.getAttributes();
  const columns: Record<string, ColumnDefinition> = {};

  for (const [attributeName, raw] of Object.entries(attributes)) {
    const attribute = raw as unknown as AttributeLike;
    const columnName = attribute.field || attribute.fieldName || attributeName;

    columns[columnName] = buildColumnDefinition(attribute);
  }

  return columns;
};

const migration: Migration = {
  async up({ queryInterface, sequelize, transaction }) {
    const allTables = await queryInterface.showAllTables();
    const existingTables = new Set(
      allTables.map(normalizeTableName).filter(Boolean)
    );

    for (const model of MODELS) {
      const tableName = normalizeTableName(model.getTableName());
      if (!tableName) continue;

      const modelColumns = getModelColumns(model);

      if (!existingTables.has(tableName)) {
        await queryInterface.createTable(tableName, modelColumns as any, {
          transaction,
        });
        existingTables.add(tableName);
        continue;
      }

      const currentTable = await queryInterface.describeTable(tableName);
      let tableHasData: boolean | null = null;

      for (const [columnName, columnDefinition] of Object.entries(
        modelColumns
      )) {
        if (columnName in currentTable) continue;

        const isNotNull = columnDefinition.allowNull === false;
        const hasDefaultValue =
          columnDefinition.defaultValue !== undefined &&
          columnDefinition.defaultValue !== null;

        const isDokumenTipeDokumenId =
          tableName === 'prs_dokumen' && columnName === 'tipe_dokumen_id';

        const isTimestampColumn =
          columnName === 'createdAt' ||
          columnName === 'updatedAt' ||
          columnName === 'created_at' ||
          columnName === 'updated_at';

        if (isTimestampColumn && isNotNull && !hasDefaultValue) {
          await queryInterface.addColumn(
            tableName,
            columnName,
            { ...columnDefinition, defaultValue: DataTypes.NOW } as any,
            { transaction }
          );
          continue;
        }

        if (isNotNull && !hasDefaultValue) {
          tableHasData ??= await tableHasRows(
            sequelize,
            tableName,
            transaction
          );
          if (tableHasData) {
            if (isDokumenTipeDokumenId) {
              await queryInterface.addColumn(
                tableName,
                columnName,
                { ...columnDefinition, allowNull: true } as any,
                { transaction }
              );

              const defaultTipeDokumenId = await ensureDefaultTipeDokumenId(
                sequelize,
                transaction
              );

              await sequelize.query(
                `UPDATE ${quoteQualifiedTable(tableName)}
                 SET ${quoteIdent(columnName)} = :defaultId
                 WHERE ${quoteIdent(columnName)} IS NULL`,
                {
                  type: QueryTypes.UPDATE,
                  transaction,
                  replacements: { defaultId: defaultTipeDokumenId },
                }
              );

              await queryInterface.changeColumn(
                tableName,
                columnName,
                { ...columnDefinition, allowNull: false } as any,
                { transaction }
              );

              continue;
            }

            throw new Error(
              `Tidak bisa menambahkan kolom NOT NULL tanpa default ke tabel yang sudah berisi data: ${tableName}.${columnName}. ` +
                'Solusi: buat migration manual (backfill dulu, lalu set NOT NULL) atau set defaultValue/allowNull di model.'
            );
          }
        }

        await queryInterface.addColumn(
          tableName,
          columnName,
          columnDefinition as any,
          {
            transaction,
          }
        );
      }
    }
  },

  async down() {
    // No-op: rollback otomatis untuk sync semua model berisiko merusak data.
  },
};

export default migration;
