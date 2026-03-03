import type { Model, ModelStatic } from 'sequelize';

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
  prsDokumenModel,
  prsJabatan,
  prsJamMengajarKaryawan,
  prsKontakDarurat,
  prsTipeDokumenModel,
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

const buildColumnDefinition = (
  attribute: AttributeLike
): Record<string, unknown> => {
  const column: Record<string, unknown> = {
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
): Record<string, Record<string, unknown>> => {
  const attributes = model.getAttributes();
  const columns: Record<string, Record<string, unknown>> = {};

  for (const [attributeName, raw] of Object.entries(attributes)) {
    const attribute = raw as unknown as AttributeLike;
    const columnName = attribute.field || attribute.fieldName || attributeName;

    columns[columnName] = buildColumnDefinition(attribute);
  }

  return columns;
};

const migration: Migration = {
  async up({ queryInterface, transaction }) {
    const allTables = await queryInterface.showAllTables();
    const existingTables = new Set(
      allTables.map(normalizeTableName).filter(Boolean)
    );

    for (const model of MODELS) {
      const tableName = normalizeTableName(model.getTableName());
      if (!tableName) continue;

      const modelColumns = getModelColumns(model);

      if (!existingTables.has(tableName)) {
        await queryInterface.createTable(tableName, modelColumns, {
          transaction,
        });
        existingTables.add(tableName);
        continue;
      }

      const currentTable = await queryInterface.describeTable(tableName);

      for (const [columnName, columnDefinition] of Object.entries(
        modelColumns
      )) {
        if (columnName in currentTable) continue;

        await queryInterface.addColumn(
          tableName,
          columnName,
          columnDefinition,
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
