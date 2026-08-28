import { QueryTypes, Transaction } from 'sequelize';

import { sequelize } from '../config/database';
import logger from '../utils/logger';

const DEFAULT_API_URL =
  'https://staging-sdm-izin.bpkpenaburjakarta.or.id/api/sdm-cuti/approved-summary';

type LeaveGroupName = 'cuti' | 'izinBiasa' | 'izinKhusus';

interface ApiLeaveRecord {
  id: string;
  nik: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  jumlah_hari: number;
  tipe_cuti: string;
  alasan_cuti: string | null;
  status_persetujuan: number;
  tanggal_persetujuan: string | null;
  deleted_at: string | null;
}

interface ApiLeaveGroup {
  data: ApiLeaveRecord[];
}

interface ApprovedSummaryResponse {
  cuti: ApiLeaveGroup;
  izinBiasa: ApiLeaveGroup;
  izinKhusus: ApiLeaveGroup;
}

export interface LeaveDestinationRecord {
  nik: string;
  tglCuti: string;
  approvalDate: string | null;
  keperluan: string | null;
  tipe: string;
}

export interface LeaveSyncOptions {
  dryRun?: boolean;
}

export interface LeaveSyncResult {
  applications: number;
  rows: number;
  synced: number;
  dryRun: boolean;
}

export interface LeaveRow {
  nik: string;
  tgl_cuti: string;
  approval_date: string | null;
  keperluan: string | null;
  tipe: string | null;
  tgl_insert: string | null;
  flag_pump: number;
}

function requireDatePart(value: string, field: string): string {
  const date = value.slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error(`${field} tidak valid: ${value}`);
  }
  return date;
}

function parseUtcDate(date: string): Date {
  const parsed = new Date(`${date}T00:00:00.000Z`);
  if (
    Number.isNaN(parsed.getTime()) ||
    parsed.toISOString().slice(0, 10) !== date
  ) {
    throw new Error(`Tanggal tidak valid: ${date}`);
  }
  return parsed;
}

export function expandWeekdays(startValue: string, endValue: string): string[] {
  const start = parseUtcDate(requireDatePart(startValue, 'tanggal_mulai'));
  const end = parseUtcDate(requireDatePart(endValue, 'tanggal_selesai'));
  if (end < start) {
    throw new Error('tanggal_selesai lebih awal dari tanggal_mulai');
  }

  const dates: string[] = [];
  for (
    const current = new Date(start);
    current <= end;
    current.setUTCDate(current.getUTCDate() + 1)
  ) {
    const day = current.getUTCDay();
    if (day !== 0 && day !== 6) dates.push(current.toISOString().slice(0, 10));
  }
  return dates;
}

export function mapLeaveRecord(
  record: ApiLeaveRecord
): LeaveDestinationRecord[] {
  if (!record.nik?.trim()) {
    throw new Error(`NIK kosong pada pengajuan ${record.id}`);
  }
  if (!record.tipe_cuti?.trim()) {
    throw new Error(`tipe_cuti kosong pada pengajuan ${record.id}`);
  }
  if (record.nik.trim().length > 20) {
    throw new Error(`NIK terlalu panjang pada pengajuan ${record.id}`);
  }
  if (record.tipe_cuti.trim().length > 255) {
    throw new Error(`tipe_cuti terlalu panjang pada pengajuan ${record.id}`);
  }
  if ((record.alasan_cuti?.trim().length ?? 0) > 255) {
    throw new Error(`alasan_cuti terlalu panjang pada pengajuan ${record.id}`);
  }
  if (record.status_persetujuan !== 1 || record.deleted_at != null) return [];

  const dates = expandWeekdays(record.tanggal_mulai, record.tanggal_selesai);
  if (dates.length !== record.jumlah_hari) {
    throw new Error(
      `Jumlah hari pengajuan ${record.id} tidak konsisten: ` +
        `API=${record.jumlah_hari}, hari kerja=${dates.length}`
    );
  }

  return dates.map(tglCuti => ({
    nik: record.nik.trim(),
    tglCuti,
    approvalDate: record.tanggal_persetujuan
      ? requireDatePart(record.tanggal_persetujuan, 'tanggal_persetujuan')
      : null,
    keperluan: record.alasan_cuti?.trim() || null,
    tipe: record.tipe_cuti.trim(),
  }));
}

function readBoolean(name: string, fallback = false): boolean {
  const value = process.env[name];
  if (value == null || value === '') return fallback;
  if (value === 'true' || value === '1') return true;
  if (value === 'false' || value === '0') return false;
  throw new Error(`${name} harus bernilai true/false atau 1/0`);
}

function readPositiveInteger(name: string, fallback: number): number {
  const value = Number(process.env[name] ?? fallback);
  if (!Number.isSafeInteger(value) || value <= 0) {
    throw new Error(`${name} harus berupa bilangan bulat positif`);
  }
  return value;
}

function validateResponse(value: unknown): ApprovedSummaryResponse {
  if (value == null || typeof value !== 'object') {
    throw new Error('Respons API bukan object');
  }
  const response = value as Partial<ApprovedSummaryResponse>;
  for (const group of ['cuti', 'izinBiasa', 'izinKhusus'] as LeaveGroupName[]) {
    if (!Array.isArray(response[group]?.data)) {
      throw new Error(`Respons API tidak memiliki ${group}.data`);
    }
  }
  return response as ApprovedSummaryResponse;
}

async function fetchApprovedSummary(): Promise<ApprovedSummaryResponse> {
  const apiKey = process.env.LEAVE_SYNC_API_KEY;
  if (!apiKey) throw new Error('LEAVE_SYNC_API_KEY wajib diisi');

  const timeoutMs = readPositiveInteger('LEAVE_SYNC_TIMEOUT_MS', 15_000);
  const response = await fetch(
    process.env.LEAVE_SYNC_API_URL ?? DEFAULT_API_URL,
    {
      headers: { 'x-cuti-izin-key': apiKey, accept: 'application/json' },
      signal: AbortSignal.timeout(timeoutMs),
    }
  );
  if (!response.ok) {
    throw new Error(`API cuti merespons HTTP ${response.status}`);
  }
  return validateResponse(await response.json());
}

async function upsertRows(
  rows: LeaveDestinationRecord[],
  transaction: Transaction
): Promise<number> {
  if (rows.length === 0) return 0;
  const values: string[] = [];
  const bind: unknown[] = [];
  for (const row of rows) {
    const offset = bind.length;
    values.push(
      `($${offset + 1}, $${offset + 2}, $${offset + 3}, ` +
        `$${offset + 4}, $${offset + 5})`
    );
    bind.push(row.nik, row.tglCuti, row.approvalDate, row.keperluan, row.tipe);
  }

  await sequelize.query(
    `WITH incoming (nik, tgl_cuti, approval_date, keperluan, tipe) AS (
       VALUES ${values.join(', ')}
     ), updated AS (
       UPDATE public.sdm_checkinout_cuti AS existing
          SET approval_date = incoming.approval_date::date,
              keperluan = incoming.keperluan,
              tgl_insert = CURRENT_TIMESTAMP,
              flag_pump = 0
        FROM incoming
        WHERE existing.nik = incoming.nik
          AND existing.tgl_cuti = incoming.tgl_cuti::date
       RETURNING existing.nik
     ), inserted AS (
       INSERT INTO public.sdm_checkinout_cuti
         (nik, tgl_cuti, approval_date, keperluan, tipe)
       SELECT incoming.nik,
              incoming.tgl_cuti::date,
              incoming.approval_date::date,
              incoming.keperluan,
              incoming.tipe
         FROM incoming
        WHERE NOT EXISTS (
          SELECT 1
            FROM public.sdm_checkinout_cuti AS existing
           WHERE existing.nik = incoming.nik
             AND existing.tgl_cuti = incoming.tgl_cuti::date
        )
       RETURNING nik
     )
     SELECT COUNT(*)::int AS inserted FROM inserted`,
    { bind, transaction, type: QueryTypes.SELECT }
  );
  return rows.length;
}

let syncInProgress = false;

export async function getAllLeave(): Promise<LeaveRow[]> {
  const rows = await sequelize.query<{
    nik: string;
    tgl_cuti: string;
    approval_date: string | null;
    keperluan: string | null;
    tipe: string | null;
    tgl_insert: Date | string | null;
    flag_pump: number;
  }>(
    `SELECT nik, tgl_cuti, approval_date, keperluan, tipe,
            tgl_insert, flag_pump
       FROM public.sdm_checkinout_cuti
      ORDER BY tgl_cuti DESC, nik ASC, tipe ASC`,
    { type: QueryTypes.SELECT }
  );

  return rows.map(row => ({
    ...row,
    tgl_insert:
      row.tgl_insert instanceof Date
        ? row.tgl_insert.toISOString()
        : row.tgl_insert,
  }));
}

export async function syncLeave(
  options: LeaveSyncOptions = {}
): Promise<LeaveSyncResult> {
  if (syncInProgress) throw new Error('Leave sync sedang berjalan');
  syncInProgress = true;
  const dryRun = options.dryRun ?? readBoolean('LEAVE_SYNC_DRY_RUN');

  try {
    const response = await fetchApprovedSummary();
    const groups = ['cuti', 'izinBiasa', 'izinKhusus'] as LeaveGroupName[];
    const applications = groups.flatMap(group => response[group].data);
    const rows = applications.flatMap(mapLeaveRecord);

    // Tabel tujuan menyimpan satu status cuti/izin per pegawai per tanggal.
    // Urutan kelompok API memberi prioritas pada cuti, lalu izin biasa/khusus.
    const rowsByEmployeeDate = new Map<string, LeaveDestinationRecord>();
    for (const row of rows) {
      const key = `${row.nik}\0${row.tglCuti}`;
      if (!rowsByEmployeeDate.has(key)) rowsByEmployeeDate.set(key, row);
    }
    const uniqueRows = [...rowsByEmployeeDate.values()];
    let synced = 0;
    if (!dryRun) {
      synced = await sequelize.transaction(async transaction => {
        for (let offset = 0; offset < uniqueRows.length; offset += 1000) {
          synced += await upsertRows(
            uniqueRows.slice(offset, offset + 1000),
            transaction
          );
        }
        return synced;
      });
    }

    logger.info(
      {
        applications: applications.length,
        rows: uniqueRows.length,
        synced,
        dryRun,
      },
      'Leave sync selesai'
    );
    return {
      applications: applications.length,
      rows: uniqueRows.length,
      synced,
      dryRun,
    };
  } finally {
    syncInProgress = false;
  }
}
