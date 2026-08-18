import mysql, { Pool as MySqlPool, RowDataPacket } from 'mysql2/promise';
import { QueryTypes, Transaction } from 'sequelize';

import { sequelize } from '../config/database';
import logger from '../utils/logger';

const POSTGRES_INTEGER_MAX = 2_147_483_647n;

interface AttendanceRecord extends RowDataPacket {
  id: string;
  user_id: number;
  stime: Date;
  s: number;
  p: number;
  created: Date | null;
  mesin_id: string;
}

export interface AttendanceSyncOptions {
  batchSize?: number;
  maxBatches?: number | null;
  dryRun?: boolean;
  fromDate?: string;
}

export interface AttendanceSyncResult {
  batches: number;
  processed: number;
  inserted: number;
  alreadyExisted: number;
  dryRun: boolean;
  fromDate: string;
}

interface SyncConfig {
  batchSize: number;
  maxBatches: number | null;
  dryRun: boolean;
  fromDate: string;
}

interface DestinationRecord {
  id: number;
  userid: string;
  checktime: Date;
  checktype: string;
  verifycode: number;
  machine: string;
  created: Date | null;
  createdby: string;
}

function readPositiveInteger(name: string, fallback: number): number {
  const raw = process.env[name];
  if (raw == null || raw === '') return fallback;

  const value = Number(raw);
  if (!Number.isSafeInteger(value) || value <= 0) {
    throw new Error(`${name} harus berupa bilangan bulat positif`);
  }

  return value;
}

function readBoolean(name: string, fallback = false): boolean {
  const raw = process.env[name];
  if (raw == null || raw === '') return fallback;
  if (raw === 'true' || raw === '1') return true;
  if (raw === 'false' || raw === '0') return false;
  throw new Error(`${name} harus bernilai true/false atau 1/0`);
}

function validateDate(name: string, value: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error(`${name} harus menggunakan format YYYY-MM-DD`);
  }

  const parsed = new Date(`${value}T00:00:00Z`);
  if (
    Number.isNaN(parsed.getTime()) ||
    parsed.toISOString().slice(0, 10) !== value
  ) {
    throw new Error(`${name} bukan tanggal yang valid`);
  }

  return value;
}

let syncInProgress = false;

function getSyncConfig(options: AttendanceSyncOptions): SyncConfig {
  const maxBatches = readPositiveInteger(
    'ATTENDANCE_SYNC_MAX_BATCHES',
    Number.MAX_SAFE_INTEGER
  );

  return {
    batchSize:
      options.batchSize ??
      readPositiveInteger('ATTENDANCE_SYNC_BATCH_SIZE', 500),
    maxBatches:
      options.maxBatches ??
      (maxBatches === Number.MAX_SAFE_INTEGER ? null : maxBatches),
    dryRun: options.dryRun ?? readBoolean('ATTENDANCE_SYNC_DRY_RUN'),
    fromDate: validateDate(
      'ATTENDANCE_SYNC_FROM_DATE',
      options.fromDate ?? process.env.ATTENDANCE_SYNC_FROM_DATE ?? '1970-01-01'
    ),
  };
}

function createMySqlPool(): MySqlPool {
  return mysql.createPool({
    host: process.env.ATTENDANCE_MYSQL_HOST ?? '192.168.66.20',
    port: readPositiveInteger('ATTENDANCE_MYSQL_PORT', 3306),
    database: process.env.ATTENDANCE_MYSQL_DATABASE ?? 'new_attendance',
    user: process.env.ATTENDANCE_MYSQL_USER ?? 'root',
    password: process.env.ATTENDANCE_MYSQL_PASSWORD ?? '',
    waitForConnections: true,
    connectionLimit: 2,
    connectTimeout: readPositiveInteger(
      'ATTENDANCE_MYSQL_CONNECT_TIMEOUT_MS',
      10_000
    ),
    enableKeepAlive: true,
    supportBigNumbers: true,
    bigNumberStrings: true,
    timezone: process.env.ATTENDANCE_MYSQL_TIMEZONE ?? '+07:00',
  });
}

function mapRecord(row: AttendanceRecord): DestinationRecord {
  const sourceId = BigInt(row.id);
  if (sourceId > POSTGRES_INTEGER_MAX) {
    throw new Error(
      `record.id ${row.id} melebihi kapasitas INTEGER PostgreSQL; ` +
        'ubah sdm_checkinout.id menjadi BIGINT sebelum melanjutkan'
    );
  }

  const checktype = String(row.s);
  if (checktype.length > 1) {
    throw new Error(
      `record.s ${row.s} pada id ${row.id} tidak muat di checktype VARCHAR(1)`
    );
  }

  return {
    id: Number(sourceId),
    userid: String(row.user_id),
    checktime: row.stime,
    checktype,
    verifycode: row.p,
    machine: String(row.mesin_id),
    created: row.created,
    createdby: 'sync',
  };
}

async function fetchBatch(
  pool: MySqlPool,
  batchSize: number,
  fromDate: string
): Promise<AttendanceRecord[]> {
  const startDate = `${fromDate} 00:00:00`;
  const [rows] = await pool.query<AttendanceRecord[]>(
    `SELECT id, user_id, stime, s, p, created, mesin_id
       FROM record
      WHERE sudah_sync = 0
        AND stime >= ?
      ORDER BY id ASC
      LIMIT ?`,
    [startDate, batchSize]
  );

  return rows;
}

async function insertBatch(
  records: DestinationRecord[],
  transaction: Transaction
): Promise<number> {
  if (records.length === 0) return 0;

  const values: string[] = [];
  const bind: unknown[] = [];

  for (const record of records) {
    const offset = bind.length;
    values.push(
      `($${offset + 1}, $${offset + 2}, $${offset + 3}, ` +
        `$${offset + 4}, $${offset + 5}, $${offset + 6}, ` +
        `$${offset + 7}, $${offset + 8})`
    );
    bind.push(
      record.id,
      record.userid,
      record.checktime,
      record.checktype,
      record.verifycode,
      record.machine,
      record.created,
      record.createdby
    );
  }

  const inserted = await sequelize.query<{ id: number }>(
    `INSERT INTO public.sdm_checkinout
       (id, userid, checktime, checktype, verifycode, machine, created, createdby)
     SELECT incoming.*
       FROM (VALUES ${values.join(', ')})
            AS incoming
               (id, userid, checktime, checktype, verifycode, machine, created, createdby)
      WHERE NOT EXISTS (
        SELECT 1
          FROM public.sdm_checkinout existing
         WHERE existing.id = incoming.id
      )
     RETURNING id`,
    {
      bind,
      transaction,
      type: QueryTypes.SELECT,
    }
  );

  return inserted.length;
}

async function markSourceSynced(
  pool: MySqlPool,
  sourceIds: string[]
): Promise<void> {
  if (sourceIds.length === 0) return;

  const placeholders = sourceIds.map(() => '?').join(', ');
  await pool.query(
    `UPDATE record
        SET sudah_sync = 1
      WHERE sudah_sync = 0
        AND id IN (${placeholders})`,
    sourceIds
  );
}

export async function syncAttendance(
  options: AttendanceSyncOptions = {}
): Promise<AttendanceSyncResult> {
  if (syncInProgress) {
    throw new Error('Attendance sync sedang berjalan');
  }

  syncInProgress = true;
  const config = getSyncConfig(options);
  const mysqlPool = createMySqlPool();
  let processed = 0;
  let inserted = 0;
  let batchNumber = 0;

  try {
    await Promise.all([mysqlPool.query('SELECT 1'), sequelize.authenticate()]);

    logger.info(
      {
        mysqlHost: process.env.ATTENDANCE_MYSQL_HOST ?? '192.168.66.20',
        mysqlDatabase:
          process.env.ATTENDANCE_MYSQL_DATABASE ?? 'new_attendance',
        batchSize: config.batchSize,
        dryRun: config.dryRun,
        fromDate: config.fromDate,
      },
      'Attendance sync dimulai'
    );

    while (config.maxBatches == null || batchNumber < config.maxBatches) {
      const sourceRows = await fetchBatch(
        mysqlPool,
        config.batchSize,
        config.fromDate
      );
      if (sourceRows.length === 0) break;

      const destinationRows = sourceRows.map(mapRecord);
      batchNumber += 1;

      if (config.dryRun) {
        processed += sourceRows.length;
        logger.info(
          { batch: batchNumber, records: sourceRows.length },
          'Dry-run: batch valid, tidak ada data yang diubah'
        );
        break;
      }

      const batchInserted = await sequelize.transaction(transaction =>
        insertBatch(destinationRows, transaction)
      );

      // Dilakukan setelah commit PostgreSQL. Jika update MySQL gagal, retry aman
      // karena insertBatch melewati id yang sudah ada di PostgreSQL.
      await markSourceSynced(
        mysqlPool,
        sourceRows.map(row => row.id)
      );

      processed += sourceRows.length;
      inserted += batchInserted;
      logger.info(
        {
          batch: batchNumber,
          processed: sourceRows.length,
          inserted: batchInserted,
          alreadyExisted: sourceRows.length - batchInserted,
        },
        'Batch attendance berhasil disinkronkan'
      );
    }

    logger.info(
      { batches: batchNumber, processed, inserted, dryRun: config.dryRun },
      'Attendance sync selesai'
    );

    return {
      batches: batchNumber,
      processed,
      inserted,
      alreadyExisted: config.dryRun ? 0 : processed - inserted,
      dryRun: config.dryRun,
      fromDate: config.fromDate,
    };
  } finally {
    syncInProgress = false;
    await mysqlPool.end();
  }
}
