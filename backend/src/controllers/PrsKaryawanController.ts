import { Context } from 'hono';
import { PrsKaryawanService } from '../services/PrsKaryawan.service';
import { KaryawanUnitKerjaFilter } from '../repositories/PrsKaryawanRepository';
import { PrsUnitKerjaKaryawanService } from '../services/prsUnitKerjaKaryawanService';
import { ParsedBody } from '../types/ParsedBody';
import PrsKontakDarurat from '../models/prsKontakDarurat';
import { KontakDaruratRecord } from '../types/prsKaryawan.types';
import { normalizeRelationalField } from '../utils/normalizeRelationalField';
import { AlamatDetail } from '../types/alamat.type';
import { toPlainRecord, PlainRecord } from '../utils/toPlainRecord';
import {
  ok,
  created,
  badRequest,
  notFound,
  error as responseError,
} from '../utils/response.helper';
import { logInfo, logWarn, logError } from '../utils/log.helper';
import { prsKaryawanSchema } from '../validators/PrsKaryawan.schema';
import { ZodError, z } from 'zod';
import { createClerkClient } from '@clerk/backend';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { promises as fs } from 'fs';
import { PrsMasterAlamat } from '../models';
import User from '../models/userModel';
import HistoryService from '../services/HistoryServices';
import { getJakartaDateOnly } from '../utils/dateOnly';
import { normalizeInactiveStatus } from '../utils/normalizeInactiveStatus';
import PrsUnitKerja from '../models/PrsUnitKerja';
import PrsUnitKerjaKaryawan from '../models/PrsUnitKerjaKaryawan';
import PrsJabatan from '../models/prsJabatan';
// import { PrsKeluargaKaryawanAttributes } from '../types/prsKeluargaKaryawan.types';

// import { PrsJabatanService } from '../services/prsJabatanService';
const service = new PrsKaryawanService();
type PrsKaryawanDTO = z.infer<typeof prsKaryawanSchema>;
type PrsKaryawanUpdateDTO = Partial<PrsKaryawanDTO>;

type PrsKaryawanAlamatDTO = z.infer<typeof PrsMasterAlamat>;

const getErrorMessage = (err: unknown): string =>
  err instanceof Error ? err.message : 'Unknown error';

const YAYASAN_SETEMPAT_ID = 13;

const getImportOrganizationCode = (
  body: Record<string, string>,
  key: 'kode_divisi' | 'kode_bagian' | 'kode_seksi' | 'kode_jabatan'
) => body[key]?.trim() ?? '';

const removeImportOrganizationFields = (body: Record<string, string>) => {
  [
    'kode_divisi',
    'nama_divisi',
    'kode_bagian',
    'nama_bagian',
    'kode_seksi',
    'nama_seksi',
    'kode_jabatan',
    'jabatan',
  ].forEach(key => delete body[key]);
};

const normalizeStatusAktifFilter = (
  value: string | undefined
): string | null | undefined => {
  if (value == null || value.trim() === '') return undefined;

  const normalized = value.trim().toLowerCase().replace(/[-_]+/g, ' ');
  if (normalized === 'all' || normalized === 'semua') return undefined;
  if (normalized === 'aktif') return 'Aktif';
  if (normalized === 'tidak aktif' || normalized === 'non aktif') {
    return 'Tidak Aktif';
  }

  return null;
};

const normalizeUnitKerjaQuery = (value: string | undefined) => {
  if (value == null) return undefined;
  const cleaned = value.trim();
  if (!cleaned || cleaned === 'all' || cleaned === 'semua') return undefined;
  return cleaned;
};

const getUnitKerjaFilterFromQuery = (c: Context): KaryawanUnitKerjaFilter => {
  const pick = (...keys: string[]) => {
    for (const key of keys) {
      const value = normalizeUnitKerjaQuery(c.req.query(key));
      if (value) return value;
    }
    return undefined;
  };

  return {
    kode_direktur: pick('kode_direktur', 'direktur'),
    kode_deputi: pick('kode_deputi', 'deputi'),
    kode_divisi: pick('kode_divisi', 'divisi'),
    kode_bagian: pick('kode_bagian', 'bagian'),
    kode_seksi: pick('kode_seksi', 'seksi'),
  };
};

const toPositiveInteger = (value: unknown): number | null => {
  const numberValue =
    typeof value === 'number'
      ? value
      : typeof value === 'string'
        ? Number(value)
        : NaN;

  return Number.isInteger(numberValue) && numberValue > 0 ? numberValue : null;
};

const getNestedRecord = (
  source: Record<string, unknown>,
  key: string
): Record<string, unknown> | null => {
  const value = source[key];
  return value && typeof value === 'object'
    ? (value as Record<string, unknown>)
    : null;
};

const extractEmailFromUnknown = (value: unknown): string | null => {
  if (typeof value === 'string') {
    const email = value.trim();
    return email.includes('@') ? email : null;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const email = extractEmailFromUnknown(item);
      if (email) return email;
    }
    return null;
  }

  if (!value || typeof value !== 'object') return null;

  const record = value as Record<string, unknown>;
  const preferredKeys = [
    'email',
    'email_address',
    'emailAddress',
    'email_addresses',
    'emailAddresses',
    'primary_email_address',
    'primaryEmailAddress',
  ];

  for (const key of preferredKeys) {
    const email = extractEmailFromUnknown(record[key]);
    if (email) return email;
  }

  return null;
};

const getAuthenticatedEmail = (
  auth: Record<string, unknown>
): string | null => {
  return extractEmailFromUnknown(auth);
};

const normalizeEnvValue = (value?: string): string | undefined => {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (trimmed.length < 2) return trimmed;

  const isQuoted =
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"));

  return isQuoted ? trimmed.slice(1, -1) : trimmed;
};

const getAuthenticatedEmailFromClerk = async (
  auth: Record<string, unknown>
): Promise<string | null> => {
  const userId = typeof auth.sub === 'string' ? auth.sub.trim() : '';
  const secretKey = normalizeEnvValue(process.env.CLERK_SECRET_KEY);
  if (!userId || !secretKey) return null;

  try {
    const clerkClient = createClerkClient({ secretKey });
    const user = await clerkClient.users.getUser(userId);

    return (
      user.primaryEmailAddress?.emailAddress ||
      user.emailAddresses.find(emailAddress => emailAddress.emailAddress)
        ?.emailAddress ||
      null
    );
  } catch (err) {
    await logWarn(
      `Gagal mengambil email Clerk untuk user ${userId}: ${getErrorMessage(err)}`
    );
    return null;
  }
};

const getAuthenticatedEmailFromUsers = async (
  auth: Record<string, unknown>
): Promise<string | null> => {
  const possibleIds = [auth.id, auth.user_id, auth.userId, auth.sub]
    .filter((value): value is string => typeof value === 'string')
    .map(value => value.trim())
    .filter(Boolean);

  if (possibleIds.length === 0) return null;

  const user = await User.findOne({
    where: { id: possibleIds },
    attributes: ['email'],
  });

  return user?.email?.trim() || null;
};

const getAuthenticatedEmailForLookup = async (
  auth: Record<string, unknown>
): Promise<string | null> => {
  return (
    getAuthenticatedEmail(auth) ??
    (await getAuthenticatedEmailFromUsers(auth)) ??
    (await getAuthenticatedEmailFromClerk(auth))
  );
};

const getAuthenticatedSetempatId = async (
  c: Context
): Promise<number | null> => {
  const auth = c.get('auth') as unknown as Record<string, unknown> | undefined;
  if (!auth) return null;

  const direct = toPositiveInteger(auth.id_master_setempat);
  if (direct) return direct;

  const metadataCandidates = [
    getNestedRecord(auth, 'publicMetadata'),
    getNestedRecord(auth, 'public_metadata'),
    getNestedRecord(auth, 'unsafeMetadata'),
    getNestedRecord(auth, 'unsafe_metadata'),
    getNestedRecord(auth, 'privateMetadata'),
    getNestedRecord(auth, 'private_metadata'),
    getNestedRecord(auth, 'metadata'),
  ];

  for (const metadata of metadataCandidates) {
    const id = metadata ? toPositiveInteger(metadata.id_master_setempat) : null;
    if (id) return id;
  }

  const email = await getAuthenticatedEmailForLookup(auth);
  if (!email) return null;

  return service.getSetempatIdByEmail(email);
};

export const getAllKaryawan = async (c: Context): Promise<Response> => {
  const service = new PrsKaryawanService();
  const authenticatedSetempatId = await getAuthenticatedSetempatId(c);

  try {
    const page = Number(c.req.query('page')) || 1;
    const limit = Number(c.req.query('limit')) || 10;
    if (!Number.isSafeInteger(page) || page < 1) {
      return badRequest(c, 'Query parameter page harus bilangan bulat positif');
    }
    if (!Number.isSafeInteger(limit) || limit < 1 || limit > 100) {
      return badRequest(c, 'Query parameter limit harus antara 1 dan 100');
    }
    const statusAktif = normalizeStatusAktifFilter(c.req.query('status_aktif'));
    const unitKerjaFilter = getUnitKerjaFilterFromQuery(c);
    const requestedSetempatId = toPositiveInteger(
      c.req.query('id_master_setempat')
    );

    if (statusAktif === null) {
      return badRequest(
        c,
        'Query parameter status_aktif hanya boleh Aktif atau Tidak Aktif'
      );
    }

    if (!authenticatedSetempatId) {
      return responseError(
        c,
        'Akses ditolak: id_master_setempat user tidak ditemukan',
        403
      );
    }

    await logInfo(
      `Memulai ambil data karyawan (page: ${page}, limit: ${limit})`
    );

    const result =
      authenticatedSetempatId === YAYASAN_SETEMPAT_ID && requestedSetempatId
        ? await service.getAllBySetempat(
            requestedSetempatId,
            page,
            limit,
            statusAktif,
            unitKerjaFilter
          )
        : authenticatedSetempatId === YAYASAN_SETEMPAT_ID
          ? await service.getAll(page, limit, statusAktif, unitKerjaFilter)
          : await service.getAllBySetempat(
              authenticatedSetempatId,
              page,
              limit,
              statusAktif,
              unitKerjaFilter
            );

    await logInfo(
      `Berhasil ambil ${result.data.length} data dari total ${result.pagination.total}`
    );

    return ok(c, result, 'Berhasil ambil data karyawan');
  } catch (err) {
    await logError('Gagal ambil data karyawan', err);
    throw err;
  }
};

export const exportKaryawanProfiles = async (c: Context): Promise<Response> => {
  const authenticatedSetempatId = await getAuthenticatedSetempatId(c);
  if (!authenticatedSetempatId) {
    return responseError(
      c,
      'Akses ditolak: id_master_setempat user tidak ditemukan',
      403
    );
  }

  const requestedSetempatId = toPositiveInteger(
    c.req.query('id_master_setempat')
  );
  const statusAktif = normalizeStatusAktifFilter(c.req.query('status_aktif'));
  if (statusAktif === null) {
    return badRequest(
      c,
      'Query parameter status_aktif hanya boleh Aktif atau Tidak Aktif'
    );
  }

  const setempatId =
    authenticatedSetempatId === YAYASAN_SETEMPAT_ID
      ? (requestedSetempatId ?? undefined)
      : authenticatedSetempatId;
  const data = await service.getAllForProfileExport(
    setempatId,
    statusAktif,
    getUnitKerjaFilterFromQuery(c)
  );

  return ok(c, data, 'Berhasil mengambil data profil karyawan untuk ekspor');
};

export const getCurrentKaryawanAccess = async (
  c: Context
): Promise<Response> => {
  const auth = c.get('auth') as unknown as Record<string, unknown> | undefined;
  const email = auth ? await getAuthenticatedEmailForLookup(auth) : null;
  const accessProfile = email
    ? await service.getAccessProfileByEmail(email)
    : null;
  const authenticatedSetempatId =
    accessProfile?.id_master_setempat ?? (await getAuthenticatedSetempatId(c));

  if (!authenticatedSetempatId) {
    return responseError(
      c,
      'Akses ditolak: id_master_setempat user tidak ditemukan',
      403
    );
  }

  return ok(
    c,
    {
      id_master_setempat: authenticatedSetempatId,
      can_view_all_setempat: authenticatedSetempatId === YAYASAN_SETEMPAT_ID,
      foto: accessProfile?.foto ?? null,
    },
    'Berhasil mengambil akses setempat'
  );
};

export const getAllKaryawanBySetempat = async (
  c: Context
): Promise<Response> => {
  const service = new PrsKaryawanService();
  const authenticatedSetempatId = await getAuthenticatedSetempatId(c);
  const id_master_setempat = Number(c.req.param('id_master_setempat'));

  if (!Number.isInteger(id_master_setempat) || id_master_setempat <= 0) {
    await logWarn('Parameter id_master_setempat tidak valid');
    return badRequest(c, 'Parameter id_master_setempat tidak valid');
  }

  if (!authenticatedSetempatId) {
    return responseError(
      c,
      'Akses ditolak: id_master_setempat user tidak ditemukan',
      403
    );
  }

  if (
    authenticatedSetempatId !== YAYASAN_SETEMPAT_ID &&
    authenticatedSetempatId !== id_master_setempat
  ) {
    return responseError(
      c,
      'Akses ditolak: hanya bisa melihat karyawan dengan id_master_setempat yang sama',
      403
    );
  }

  try {
    const page = Number(c.req.query('page')) || 1;
    const limit = Number(c.req.query('limit')) || 10;
    if (!Number.isSafeInteger(page) || page < 1) {
      return badRequest(c, 'Query parameter page harus bilangan bulat positif');
    }
    if (!Number.isSafeInteger(limit) || limit < 1 || limit > 100) {
      return badRequest(c, 'Query parameter limit harus antara 1 dan 100');
    }
    const statusAktif = normalizeStatusAktifFilter(c.req.query('status_aktif'));
    const unitKerjaFilter = getUnitKerjaFilterFromQuery(c);

    if (statusAktif === null) {
      return badRequest(
        c,
        'Query parameter status_aktif hanya boleh Aktif atau Tidak Aktif'
      );
    }

    await logInfo(
      `Memulai ambil data karyawan (setempat: ${id_master_setempat}, page: ${page}, limit: ${limit})`
    );

    const result = await service.getAllBySetempat(
      id_master_setempat,
      page,
      limit,
      statusAktif,
      unitKerjaFilter
    );

    await logInfo(
      `Berhasil ambil ${result.data.length} data dari total ${result.pagination.total}`
    );

    return ok(
      c,
      result,
      'Berhasil ambil data karyawan berdasarkan master setempat'
    );
  } catch (err) {
    await logError(
      'Gagal ambil data karyawan berdasarkan master setempat',
      err
    );
    throw err;
  }
};

export const getKaryawanByemail = async (c: Context): Promise<Response> => {
  const service = new PrsKaryawanService();
  // waktu mulai
  const email = c.req.param('email');

  try {
    await logInfo(`Memulai ambil data karyawan berdasarkan email: ${email}`);

    const data = await service.getByemail(email);

    // hitung durasi

    if (data) {
      await logInfo(
        `Berhasil ambil data karyawan dengan email: ${email}`,
        null
      );
      return ok(c, data, 'Berhasil ambil data karyawan');
    } else {
      await logWarn(`Karyawan dengan email ${email} tidak ditemukan`, null);
      return notFound(c, 'Karyawan tidak ditemukan');
    }
  } catch (err) {
    // hitung durasi meskipun error
    await logError(`Gagal ambil data karyawan dengan email: ${email}`, err);
    throw err;
  }
};

// ✅ Cari berdasarkan nama lengkap
// controller/prsKaryawanController.ts

interface KaryawanFormatted {
  [key: string]: unknown;
  jab_id?: string;
  jabatan?: string;
  status_karyawan?: string;
}

type KaryawanDetailFlatValue = string | number | null;

const formatKaryawanDetailData = (
  data: unknown
): Record<string, KaryawanDetailFlatValue | Record<string, unknown>> => {
  const plainData: Record<string, string | number | null | undefined> =
    data &&
    typeof data === 'object' &&
    'toJSON' in data &&
    typeof (data as { toJSON?: unknown }).toJSON === 'function'
      ? ((data as { toJSON: () => unknown }).toJSON() as Record<
          string,
          string | number | null | undefined
        >)
      : (data as Record<string, string | number | null | undefined>);

  const filteredData: Record<
    string,
    KaryawanDetailFlatValue | Record<string, unknown>
  > = {};

  Object.entries(plainData).forEach(([key, value]) => {
    const parts = key.split('.');
    const secondLastKey = parts[parts.length - 2];
    const lastKey = parts[parts.length - 1];

    const relationalKeys = [
      'direktur',
      'deputi',
      'divisi',
      'bagian',
      'seksi',
      'unit_kerja',
      'jabatan',
      'mapel',
    ];

    const excludeKeys = [
      'sek_id',
      'bag_id',
      'div_id',
      'dep_id',
      'dir_id',
      'mapel_id',
      'jab_id',
    ];

    if (secondLastKey === 'agama_detail') {
      if (lastKey === 'id') {
        filteredData['kode_agama'] = value as KaryawanDetailFlatValue;
        return;
      }

      if (lastKey === 'agama') {
        filteredData['agama'] = value as KaryawanDetailFlatValue;
        return;
      }
    }

    if (
      key === 'agama' &&
      Object.prototype.hasOwnProperty.call(filteredData, 'agama')
    ) {
      filteredData['kode_agama'] = value as KaryawanDetailFlatValue;
      return;
    }

    if (key.endsWith('agama_detail.agama')) {
      filteredData['agama'] = value as KaryawanDetailFlatValue;
      return;
    }

    if (
      secondLastKey &&
      relationalKeys.includes(secondLastKey) &&
      !excludeKeys.includes(lastKey)
    ) {
      const mappedKey = secondLastKey;
      if (!filteredData[mappedKey]) filteredData[mappedKey] = {};
      (filteredData[mappedKey] as Record<string, unknown>)[lastKey] = value;
      return;
    }

    if (parts.length === 1) {
      filteredData[key] = value as KaryawanDetailFlatValue;
      return;
    }

    if (key.endsWith('stat_karyawan_gp')) {
      filteredData['kode_status_karyawan'] =
        value !== undefined ? String(value) : '';
    }
  });

  return filteredData;
};

export const searchByNamaLengkap = async (c: Context): Promise<Response> => {
  const service = new PrsKaryawanService();
  const authenticatedSetempatId = await getAuthenticatedSetempatId(c);
  const nama_lengkap = c.req.query('nama_lengkap');
  const page = Number(c.req.query('page')) || 1;
  const limit = Number(c.req.query('limit')) || 10;
  const statusAktif = normalizeStatusAktifFilter(c.req.query('status_aktif'));
  const unitKerjaFilter = getUnitKerjaFilterFromQuery(c);
  const idMasterSetempatRaw = c.req.query('id_master_setempat');
  const idMasterSetempat =
    idMasterSetempatRaw != null ? Number(idMasterSetempatRaw) : undefined;

  if (!nama_lengkap) {
    await logWarn('Parameter query nama_lengkap tidak diberikan');
    return badRequest(c, 'Query parameter nama_lengkap diperlukan');
  }

  if (!authenticatedSetempatId) {
    return responseError(
      c,
      'Akses ditolak: id_master_setempat user tidak ditemukan',
      403
    );
  }

  if (statusAktif === null) {
    return badRequest(
      c,
      'Query parameter status_aktif hanya boleh Aktif atau Tidak Aktif'
    );
  }

  if (
    idMasterSetempatRaw != null &&
    (!Number.isInteger(idMasterSetempat) || Number(idMasterSetempat) <= 0)
  ) {
    await logWarn('Parameter query id_master_setempat tidak valid');
    return badRequest(c, 'Query parameter id_master_setempat tidak valid');
  }

  if (
    authenticatedSetempatId !== YAYASAN_SETEMPAT_ID &&
    idMasterSetempat != null &&
    idMasterSetempat !== authenticatedSetempatId
  ) {
    return responseError(
      c,
      'Akses ditolak: hanya bisa mencari karyawan dengan id_master_setempat yang sama',
      403
    );
  }

  const effectiveSetempatId =
    authenticatedSetempatId === YAYASAN_SETEMPAT_ID
      ? idMasterSetempat
      : authenticatedSetempatId;

  try {
    await logInfo(
      `Memulai pencarian karyawan berdasarkan nama_lengkap: ${nama_lengkap}`
    );

    const result = await service.findByNameAscPaginated(
      nama_lengkap,
      page,
      limit,
      effectiveSetempatId,
      statusAktif,
      unitKerjaFilter
    );

    if (!result.data || result.data.length === 0) {
      await logWarn(
        `Tidak ada karyawan ditemukan dengan nama: ${nama_lengkap}`
      );
      return ok(
        c,
        {
          total: 0,
          page,
          limit,
          total_pages: 0,
          data: [],
        },
        'Tidak ada karyawan ditemukan'
      );
    }

    const Pemisah = {
      jab_id: 'jab_id',
      jabatan: 'jabatan',
      status_karyawan: 'stat_karyawan_gp',
    } as const;

    const formattedData: KaryawanFormatted[] = result.data.map(item => {
      const plainData: Record<string, unknown> =
        typeof (item as { toJSON?: () => unknown }).toJSON === 'function'
          ? (item as { toJSON: () => Record<string, unknown> }).toJSON()
          : (item as unknown as Record<string, unknown>);

      const filteredData: Record<string, unknown> = {};

      for (const key of Object.keys(plainData)) {
        const splitKey = key.split('.');
        const lastKey = splitKey[splitKey.length - 1];

        if (lastKey === 'kode' || lastKey.endsWith('_id')) {
          const parentKey = splitKey[
            splitKey.length - 2
          ] as keyof typeof Pemisah;
          if (parentKey && Pemisah[parentKey]) {
            const fieldNama =
              splitKey.slice(0, -1).join('.') + '.' + Pemisah[parentKey];
            filteredData[parentKey] = {
              id: plainData[key],
              nama: plainData[fieldNama] ?? null,
            };
            continue;
          }
        }

        if (!key.includes('.')) {
          filteredData[key] = plainData[key];
        }

        if (key.endsWith('jab_id')) filteredData['jab_id'] = plainData[key];
        if (key.endsWith('jabatan')) filteredData['jabatan'] = plainData[key];
        if (key.endsWith('stat_karyawan_gp'))
          filteredData['status_karyawan'] = plainData[key];
      }

      return filteredData;
    });

    await logInfo(
      `Berhasil menemukan ${formattedData.length} karyawan dengan nama mengandung: ${nama_lengkap}`
    );

    return ok(
      c,
      {
        total: result.total,
        page,
        limit,
        total_pages: Math.ceil(result.total / limit),
        data: formattedData,
      },
      'Berhasil ambil data karyawan'
    );
  } catch (err: unknown) {
    await logError(`Gagal mencari karyawan dengan nama: ${nama_lengkap}`, err);
    const message =
      err instanceof Error ? err.message : 'Terjadi kesalahan tidak terduga';
    return badRequest(c, message);
  }
};

export const getKaryawanById = async (c: Context): Promise<Response> => {
  const service = new PrsKaryawanService();
  const id = c.req.param('id');

  if (!id) {
    await logWarn('Parameter "id" wajib diisi');
    return badRequest(c, 'Parameter id wajib diisi');
  }

  await logInfo(`Memulai ambil data karyawan berdasarkan ID: ${id}`);

  // ✅ Ambil data karyawan
  const data = await service.getById(id);

  const filteredData = formatKaryawanDetailData(data);

  await logInfo(`✅ Berhasil ambil data karyawan: ${id}`);
  return ok(c, filteredData, `Berhasil ambil data karyawan: ${id}`);
};

export const getKaryawanByIdOrNik = async (c: Context): Promise<Response> => {
  const service = new PrsKaryawanService();
  const identifier = c.req.param('identifier');

  if (!identifier) {
    await logWarn('Parameter "identifier" wajib diisi');
    return badRequest(c, 'Parameter id_karyawan atau nik wajib diisi');
  }

  await logInfo(
    `Memulai ambil data karyawan berdasarkan id_karyawan/nik: ${identifier}`
  );

  const data = await service.getByIdOrNik(identifier);
  const filteredData = formatKaryawanDetailData(data);

  await logInfo(`✅ Berhasil ambil data karyawan: ${identifier}`);
  return ok(c, filteredData, `Berhasil ambil data karyawan: ${identifier}`);
};

// ✅ Create karyawan
export const createKaryawan = async (c: Context): Promise<Response> => {
  const service = new PrsKaryawanService();
  try {
    await logInfo('Memulai proses create karyawan');
    const form = await c.req.formData();
    const file = form.get('foto') as File | null;

    const parsedBody: Record<string, string> = {};

    form.forEach((value, key) => {
      if (typeof value === 'string') {
        parsedBody[key] = value;
      }
    });

    const organizationCodes = {
      kode_divisi: getImportOrganizationCode(parsedBody, 'kode_divisi'),
      kode_bagian: getImportOrganizationCode(parsedBody, 'kode_bagian'),
      kode_seksi: getImportOrganizationCode(parsedBody, 'kode_seksi'),
      kode_jabatan: getImportOrganizationCode(parsedBody, 'kode_jabatan'),
    };
    const organizationCodeValues = Object.values(organizationCodes);
    const hasOrganizationCodes = organizationCodeValues.some(Boolean);

    if (hasOrganizationCodes && organizationCodeValues.some(code => !code)) {
      return badRequest(
        c,
        'Kode divisi, bagian, seksi, dan jabatan harus diisi seluruhnya untuk membuat unit kerja karyawan'
      );
    }

    let unitKerja: PrsUnitKerja | null = null;
    let jabatan: PrsJabatan | null = null;

    if (hasOrganizationCodes) {
      [unitKerja, jabatan] = await Promise.all([
        PrsUnitKerja.findOne({
          where: {
            kode_divisi: organizationCodes.kode_divisi,
            kode_bagian: organizationCodes.kode_bagian,
            kode_seksi: organizationCodes.kode_seksi,
          },
        }),
        PrsJabatan.findOne({
          where: { kode_jab: organizationCodes.kode_jabatan },
        }),
      ]);

      if (!unitKerja) {
        return badRequest(
          c,
          'Kombinasi kode divisi, bagian, dan seksi tidak ditemukan pada master unit kerja'
        );
      }

      if (!jabatan) {
        return badRequest(
          c,
          'Kode jabatan tidak ditemukan pada master jabatan'
        );
      }
    }

    removeImportOrganizationFields(parsedBody);

    if (!parsedBody.id_karyawan) {
      parsedBody.id_karyawan = uuidv4();
    }

    // konversi numeric fields
    if (parsedBody.agama) parsedBody.agama = String(Number(parsedBody.agama));
    if (parsedBody.tinggi_badan)
      parsedBody.tinggi_badan = String(Number(parsedBody.tinggi_badan));
    if (parsedBody.berat_badan)
      parsedBody.berat_badan = String(Number(parsedBody.berat_badan));
    if (parsedBody.id_master_setempat)
      parsedBody.id_master_setempat = String(
        Number(parsedBody.id_master_setempat)
      );

    // handle file upload
    if (file && file.name) {
      const ext = path.extname(file.name);
      const filename = `${uuidv4()}${ext}`;
      const uploadDir = path.join('uploads', 'karyawan');
      await fs.mkdir(uploadDir, { recursive: true });
      const filepath = path.join(uploadDir, filename);
      const buffer = Buffer.from(await file.arrayBuffer());
      await fs.writeFile(filepath, buffer);
      parsedBody.foto = path.join('uploads/karyawan', filename);
    }

    // validasi ke DTO
    const validated: PrsKaryawanDTO = prsKaryawanSchema.parse(parsedBody);

    const createdData = await service.create(validated);

    if (unitKerja && jabatan) {
      await PrsUnitKerjaKaryawan.create({
        ukk_id: uuidv4(),
        karyawan_id: createdData.id_karyawan,
        unit_kerja: unitKerja.uk_id,
        jab_id: jabatan.kode_jab,
        lokasi_penggajian: '',
      });
    }

    await logInfo(`Karyawan berhasil dibuat dengan ID: ${createdData}`);
    return created(c, createdData);
  } catch (err) {
    if (err instanceof ZodError) {
      await logWarn('Validasi gagal saat create karyawan');
      return badRequest(c, 'Validasi gagal', err.issues);
    }
    await logError('Gagal membuat data karyawan', err);
    return badRequest(c, 'Gagal membuat data', {
      message: getErrorMessage(err),
    });
  }
};

//update

export const updateEmployeeProfile = async (c: Context) => {
  const idKaryawan = c.req.param('id_karyawan');

  const karyawanService = new PrsKaryawanService();
  const unitKerjaService = new PrsUnitKerjaKaryawanService();
  const historyService = new HistoryService();

  try {
    await logInfo(`🟢 Update profil karyawan ID: ${idKaryawan}`);
    await logInfo('🔥🔥🔥 HIT UPDATE EMPLOYEE PROFILE vDBG-20260202-1504');

    // =====================================================
    // AMBIL DATA LAMA
    // =====================================================
    const beforeUpdate = await karyawanService.getById(idKaryawan);
    if (!beforeUpdate) {
      return notFound(c, 'Karyawan tidak ditemukan');
    }

    // 🔑 CAST KE PLAIN OBJECT (AMAN UNTUK INDEX STRING)
    const beforeUpdatePlain: Record<string, unknown> =
      typeof (beforeUpdate as { toJSON?: () => unknown }).toJSON === 'function'
        ? ((beforeUpdate as { toJSON: () => unknown }).toJSON() as Record<
            string,
            unknown
          >)
        : (beforeUpdate as unknown as Record<string, unknown>);

    let parsedBody: ParsedBody = {};
    let file: File | null = null;
    const contentType = c.req.header('content-type') ?? '';

    // =====================================================
    // PARSE BODY
    // =====================================================
    if (contentType.includes('multipart/form-data')) {
      const form = await c.req.formData();
      file = form.get('foto') as File | null;

      form.forEach((value, key) => {
        if (key === 'foto') return;
        if (typeof value === 'string') {
          parsedBody[key] = value;
        }
      });
    } else if (contentType.includes('application/json')) {
      parsedBody = await c.req.json();
    } else {
      return badRequest(c, 'Unsupported Content-Type');
    }

    parsedBody = normalizeInactiveStatus(parsedBody);

    // =====================================================
    // NORMALISASI ANGKA
    // =====================================================
    ['tinggi_badan', 'berat_badan'].forEach(field => {
      if (parsedBody[field] != null) {
        parsedBody[field] = String(Number(parsedBody[field]));
      }
    });

    // =====================================================
    // NORMALISASI RELASIONAL
    // =====================================================
    [
      'agama_detail',
      'kode_status_karyawan',
      'kode_golongan', // ✅ TAMBAH: biar kalau bentuknya object relasional jadi value yang benar
      'direktur',
      'deputi',
      'divisi',
      'bagian',
      'seksi',
      'ukk_id',
      'jabatan',
      'mapel',
    ].forEach(key => {
      if (parsedBody[key] !== undefined && parsedBody[key] !== null) {
        parsedBody[key] = normalizeRelationalField(parsedBody[key]);
      }
    });

    if (parsedBody.agama_detail) {
      parsedBody.agama = parsedBody.agama_detail;
      delete parsedBody.agama_detail;
    }

    // =====================================================
    // UPLOAD FOTO
    // =====================================================
    if (file && file.name) {
      const ext = path.extname(file.name);
      const filename = `${uuidv4()}${ext}`;
      const filepath = `uploads/karyawan/${filename}`;

      await fs.writeFile(filepath, Buffer.from(await file.arrayBuffer()));
      parsedBody.foto = filepath;

      await historyService.createHistory({
        id_karyawan: idKaryawan,
        tipe_perubahan: 'foto: diganti',
        value_lama: `foto: ${String(beforeUpdatePlain.foto ?? '')}`,
      });
    }

    // =====================================================
    // PISAHKAN FIELD
    // =====================================================
    const {
      unit_kerja,
      jabatan,
      direktur,
      deputi,
      divisi,
      bagian,
      seksi,
      mapel,
      ...karyawanFields
    } = parsedBody;

    // =====================================================
    // UPDATE DATA KARYAWAN
    // =====================================================
    if (Object.keys(karyawanFields).length > 0) {
      const validated = prsKaryawanSchema.partial().parse(karyawanFields);

      // =====================================================
      // ✅ HISTORY KHUSUS: kode_golongan
      // (biar pasti ke-log dan format rapi, serta tidak dobel)
      // =====================================================
      const newGolRaw = (validated as Record<string, unknown>).kode_golongan;

      if (newGolRaw !== undefined && newGolRaw !== null) {
        const newGol = String(newGolRaw).trim();
        const oldGol = String(beforeUpdatePlain.kode_golongan ?? '').trim();

        if (oldGol !== newGol) {
          await historyService.createHistory({
            id_karyawan: idKaryawan,
            tipe_perubahan: `kode_golongan: ${newGol}`,
            value_lama: `kode_golongan: ${oldGol}`,
          });
        }
      }

      for (const [key, newValue] of Object.entries(validated)) {
        // ✅ jangan dobel karena sudah ditangani khusus di atas
        if (key === 'kode_golongan') continue;

        const oldValue = beforeUpdatePlain[key];

        console.log('[HISTORY FIELD]', { key, oldValue, newValue });

        if (String(oldValue ?? '') === String(newValue ?? '')) continue;

        await historyService.createHistory({
          id_karyawan: idKaryawan,
          tipe_perubahan: key,
          value_lama: oldValue != null ? String(oldValue) : null,
        });
      }

      await karyawanService.update(idKaryawan, validated);
    }

    // =====================================================
    // UPDATE UNIT KERJA
    // =====================================================
    const unitKerjaUpdate: Record<string, unknown> = {};

    if (unit_kerja) unitKerjaUpdate.unit_kerja = unit_kerja;
    if (jabatan) unitKerjaUpdate.jab_id = jabatan;
    if (direktur) unitKerjaUpdate.direktur_id = direktur;
    if (deputi) unitKerjaUpdate.deputi_id = deputi;
    if (divisi) unitKerjaUpdate.divisi_id = divisi;
    if (bagian) unitKerjaUpdate.bagian_id = bagian;
    if (seksi) unitKerjaUpdate.seksi_id = seksi;

    if (Object.keys(unitKerjaUpdate).length > 0) {
      await unitKerjaService.updateByJabId(idKaryawan, unitKerjaUpdate);

      const beforeUnitKerja =
        (beforeUpdatePlain.unit_kerja as Record<string, unknown>) ?? {};

      for (const [key, newValue] of Object.entries(unitKerjaUpdate)) {
        const oldValue = beforeUnitKerja[key];

        await historyService.createHistory({
          id_karyawan: idKaryawan,
          tipe_perubahan: `${key}: ${String(newValue)}`,
          value_lama: `${key}: ${String(oldValue ?? '')}`,
        });
      }
    }

    // =====================================================
    // UPDATE MAPEL
    // =====================================================
    if (mapel !== undefined && mapel !== null) {
      const mapelStr = String(mapel); // ✅ FIX UTAMA

      const beforeMapel =
        (beforeUpdatePlain.mapel as Record<string, unknown>)?.nama ?? '';

      await karyawanService.updateMengajarMapelByKaryawanId(
        idKaryawan,
        mapelStr
      );

      await historyService.createHistory({
        id_karyawan: idKaryawan,
        tipe_perubahan: `mapel: ${mapelStr}`,
        value_lama: `mapel: ${beforeMapel}`,
      });
    }

    // =====================================================
    // RESPONSE
    // =====================================================
    const updated = await karyawanService.getById(idKaryawan);

    return ok(c, updated, 'Profil karyawan berhasil diperbarui');
  } catch (err) {
    if (err instanceof ZodError) {
      return badRequest(c, 'Validasi gagal', err.issues);
    }

    return badRequest(c, 'Gagal memperbarui data', {
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};

export const updateKaryawan = async (c: Context): Promise<Response> => {
  const service = new PrsKaryawanService();
  const historyService = new HistoryService(); // ✅ tambah
  const id = c.req.param('id');

  try {
    await logInfo(`Memulai update data karyawan ID: ${id}`);

    // -------------------------------------------------------
    // AMBIL DATA LAMA (UNTUK HISTORY)
    // -------------------------------------------------------
    const beforeUpdate = await service.getById(id);
    if (!beforeUpdate) {
      return notFound(c, 'Karyawan tidak ditemukan');
    }

    // 🔑 CAST KE PLAIN OBJECT (AMAN UNTUK INDEX STRING)
    const beforeUpdatePlain: Record<string, unknown> =
      typeof (beforeUpdate as { toJSON?: () => unknown }).toJSON === 'function'
        ? ((beforeUpdate as { toJSON: () => unknown }).toJSON() as Record<
            string,
            unknown
          >)
        : (beforeUpdate as unknown as Record<string, unknown>);

    const parsedBody: Record<string, string> = {};
    let file: File | null = null;

    const contentType = c.req.header('content-type') ?? '';

    // -------------------------------------------------------
    // PARSE BODY
    // -------------------------------------------------------
    if (contentType.includes('multipart/form-data')) {
      const form = await c.req.formData();
      file = form.get('foto') as File | null;

      form.forEach((value, key) => {
        if (key === 'foto') return;
        if (typeof value === 'string') {
          parsedBody[key] = value;
        }
      });
    } else if (contentType.includes('application/json')) {
      const body = await c.req.json<Record<string, unknown>>();

      Object.entries(body).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          parsedBody[key] = String(value);
        }
      });
    } else {
      return badRequest(c, 'Unsupported Content-Type');
    }

    // -------------------------------------------------------
    // NORMALISASI ANGKA
    // -------------------------------------------------------
    if (parsedBody.agama) {
      parsedBody.agama = String(Number(parsedBody.agama));
    }
    if (parsedBody.tinggi_badan) {
      parsedBody.tinggi_badan = String(Number(parsedBody.tinggi_badan));
    }
    if (parsedBody.berat_badan) {
      parsedBody.berat_badan = String(Number(parsedBody.berat_badan));
    }

    // -------------------------------------------------------
    // (OPSIONAL) NORMALISASI RELASIONAL UNTUK kode_golongan
    // Kalau FE kadang kirim object, kamu bisa handle di level atas.
    // Karena parsedBody di sini sudah string, jadi aman.
    // -------------------------------------------------------

    // -------------------------------------------------------
    // UPLOAD FOTO
    // -------------------------------------------------------
    if (file && file.name) {
      const ext = path.extname(file.name);
      const filename = `${uuidv4()}${ext}`;
      const filepath = path.join('uploads/karyawan', filename);

      await fs.mkdir(path.dirname(filepath), { recursive: true });
      const buffer = Buffer.from(await file.arrayBuffer());
      await fs.writeFile(filepath, buffer);

      parsedBody.foto = `uploads/karyawan/${filename}`;
    }

    // -------------------------------------------------------
    // VALIDASI (PARTIAL)
    // -------------------------------------------------------
    const validated: PrsKaryawanUpdateDTO = prsKaryawanSchema
      .partial()
      .parse(parsedBody);

    // -------------------------------------------------------
    // HISTORY KHUSUS: kode_golongan
    // -------------------------------------------------------
    const newGolRaw = (validated as Record<string, unknown>).kode_golongan;

    if (newGolRaw !== undefined && newGolRaw !== null) {
      const newGol = String(newGolRaw).trim();
      const oldGol = String(beforeUpdatePlain.kode_golongan ?? '').trim();

      if (oldGol !== newGol) {
        await historyService.createHistory({
          id_karyawan: id,
          tipe_perubahan: `kode_golongan: ${newGol}`,
          value_lama: `kode_golongan: ${oldGol}`,
        });
      }
    }

    // -------------------------------------------------------
    // UPDATE DATA
    // -------------------------------------------------------
    await service.update(id, validated);

    const updatedData = await service.getById(id);

    await logInfo(`Data karyawan ID: ${id} berhasil diperbarui`);
    return ok(c, updatedData, 'Data karyawan berhasil diperbarui');
  } catch (err: unknown) {
    if (err instanceof ZodError) {
      await logWarn('Validasi gagal saat update karyawan', err.issues);
      return badRequest(c, 'Validasi gagal', err.issues);
    }

    await logError(`Gagal memperbarui data karyawan ID: ${id}`, err);
    return badRequest(c, 'Gagal memperbarui data', {
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};

// ✅ Update status jadi tidak aktif
export const updateStatusTidakAktif = async (c: Context): Promise<Response> => {
  const service = new PrsKaryawanService();
  const historyService = new HistoryService();

  try {
    const id = c.req.param('id');
    await logInfo(`Mengubah status karyawan ID: ${id} menjadi Tidak Aktif`);

    // -------------------------------------------------------
    // AMBIL DATA SEBELUM UPDATE
    // -------------------------------------------------------
    const beforeUpdate = await service.getById(id);
    if (!beforeUpdate) {
      return badRequest(c, 'Data karyawan tidak ditemukan');
    }

    const beforeUpdatePlain =
      typeof (beforeUpdate as any).get === 'function'
        ? (beforeUpdate as any).get({ plain: true })
        : beforeUpdate;

    // -------------------------------------------------------
    // UPDATE STATUS
    // -------------------------------------------------------
    await service.updateStatusTidakAktif(id, 'Tidak Aktif');

    // -------------------------------------------------------
    // SIMPAN HISTORY
    // -------------------------------------------------------
    await historyService.createHistory({
      id_karyawan: id,
      tipe_perubahan: 'status: diubah',
      value_lama: `status: ${String(beforeUpdatePlain.status_karyawan ?? '')}`,
    });

    return ok(
      c,
      null,
      `Status karyawan ${id} berhasil diubah menjadi Tidak Aktif`
    );
  } catch (err) {
    await logError('Gagal mengubah status karyawan', err);
    return badRequest(c, 'Gagal mengubah status', {
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};

export const getKaryawanByJoinDate = async (c: Context) => {
  const service = new PrsKaryawanService();
  const today = new Date().toISOString().split('T')[0];

  try {
    const result = await service.getKaryawanByJoinDate(today);

    // Jika kosong
    if (result.total === 0) {
      await logWarn(`Tidak ada karyawan yang join pada ${today}`, null);

      return ok(
        c,
        {
          total: 0,
          date: today,
          data: [],
        },
        `Tidak ada karyawan yang join pada tanggal ${today}`
      );
    }

    // Jika ada data
    await logInfo(
      `Berhasil ambil ${result.total} karyawan yang join pada ${today}`,
      null
    );

    return ok(c, result, 'Berhasil ambil data karyawan yang join');
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';

    await logError(
      `Gagal ambil karyawan yang join pada tanggal ${today}. ${errorMsg}`,
      null
    );

    return badRequest(c, 'Terjadi kesalahan saat mengambil data karyawan', {
      message: errorMsg,
    });
  }
};

export const getKaryawanOffboardingToday = async (c: Context) => {
  const service = new PrsKaryawanService();
  const today = getJakartaDateOnly();

  try {
    const result = await service.getKaryawanOffboardingByDate(today);
    const message = result.total
      ? 'Berhasil ambil data karyawan offboarding hari ini'
      : `Tidak ada karyawan offboarding pada tanggal ${today}`;

    return ok(c, result, message);
  } catch (err: unknown) {
    const errorMessage = getErrorMessage(err);
    await logError(
      `Gagal ambil karyawan offboarding tanggal ${today}. ${errorMessage}`,
      null
    );

    return badRequest(c, 'Terjadi kesalahan saat mengambil data offboarding', {
      message: errorMessage,
    });
  }
};

// ✅ Ambil karyawan yang ulang tahun hari ini
// export const getKaryawanBirthdayToday = async (
//   c: Context
// ): Promise<Response> => {
//   const service = new PrsKaryawanService();

//   try {
//     const page = Number(c.req.query('page')) || 1;
//     const limit = Number(c.req.query('limit')) || 3;

//     const result = await service.getKaryawanBirthdayToday(page, limit);

//     if (!result.data || result.data.length === 0) {
//       await logWarn('Tidak ada karyawan ulang tahun hari ini');
//       return notFound(c, 'Tidak ada karyawan yang berulang tahun hari ini');
//     }

//     await logInfo(
//       `Berhasil ambil ${result.data.length} karyawan ulang tahun hari ini`
//     );

//     return ok(c, result, 'Berhasil ambil data ulang tahun hari ini');
//   } catch (err: unknown) {
//     await logError('Gagal ambil data ulang tahun karyawan', err);
//     return badRequest(c, 'Terjadi kesalahan saat mengambil data ulang tahun');
//   }
// };

export const getKaryawanBirthdayToday = async (
  c: Context
): Promise<Response> => {
  const service = new PrsKaryawanService();

  try {
    const page = Number(c.req.query('page')) || 1;
    const limit = Number(c.req.query('limit')) || 3;

    const result = await service.getKaryawanBirthdayToday(page, limit);

    // Jika data kosong → tetap success:true
    if (!result.data || result.data.length === 0) {
      await logWarn('Tidak ada karyawan ulang tahun hari ini');

      return ok(
        c,
        {
          total: 0,
          page,
          limit,
          total_pages: 0,
          data: [],
        },
        'Tidak ada karyawan ditemukan'
      );
    }

    // Jika ada data
    await logInfo(
      `Berhasil ambil ${result.data.length} karyawan ulang tahun hari ini`
    );

    return ok(c, result, 'Berhasil ambil data ulang tahun hari ini');
  } catch (err: unknown) {
    await logError('Gagal ambil data ulang tahun karyawan', err);
    return badRequest(c, 'Terjadi kesalahan saat mengambil data ulang tahun');
  }
};

// ✅ Ambil jumlah karyawan aktif
export const getJumlahKaryawanAktif = async (c: Context) => {
  const service = new PrsKaryawanService();
  try {
    const count = await service.getCountAktif();
    await logInfo(`Jumlah karyawan aktif: ${count}`);
    return ok(c, count);
  } catch (err) {
    await logError('Gagal ambil jumlah karyawan aktif', err);
    return badRequest(c, 'Terjadi kesalahan saat mengambil jumlah karyawan');
  }
};

// ✅ Ambil jumlah karyawan tidak aktif
export const getJumlahKaryawanTidakAktif = async (c: Context) => {
  const service = new PrsKaryawanService();
  try {
    const count = await service.getCountTidakAktif();
    await logInfo(`Jumlah karyawan tidak aktif: ${count}`);
    return ok(c, count);
  } catch (err) {
    await logError('Gagal ambil jumlah karyawan tidak aktif', err);
    return badRequest(
      c,
      'Terjadi kesalahan saat mengambil jumlah karyawan tidak aktif'
    );
  }
};
export const getUnitKerjaByKaryawanId = async (c: Context) => {
  const service = new PrsKaryawanService();

  try {
    const id = c.req.param('id') ?? '';
    await logInfo(
      `Request getUnitKerjaByKaryawanId dengan id_karyawan = ${id}`
    );

    // 1️⃣ Ambil data
    const data = await service.getUnitKerjaByKaryawanId(id);
    if (!data) return notFound(c, 'Data Karyawan tidak ditemukan');

    // 2️⃣ Plain object
    const plainData = data.get({ plain: true }) as {
      id_karyawan?: string | null;
      nik?: string | null;
      nama_lengkap?: string | null;
      tgl_join_penabur?: string | null;
      tgl_join_penabur_jkt?: string | null;
      tanggal_inactive?: string | null;
      unit_kerja_karyawan?:
        | {
            ukk_id?: string | null;
            unit_kerja_detail?: {
              seksi?: {
                id?: string | null;
                name?: string | null;
                nama_sek?: string | null;
              };
              bagian?: {
                id?: string | null;
                name?: string | null;
                nama_bag?: string | null;
              };
              divisi?: {
                id?: string | null;
                name?: string | null;
                nama_div?: string | null;
              };
              deputi?: {
                id?: string | null;
                name?: string | null;
                nama_dep?: string | null;
              };
              direktur?: {
                id?: string | null;
                name?: string | null;
                nama_dir?: string | null;
              };
            };
            jam_mengajar?:
              | {
                  jam_mengajar?: string | null;
                  mapel?: { nama_mapel?: string | null };
                }[]
              | {
                  jam_mengajar?: string | null;
                  mapel?: { nama_mapel?: string | null };
                };
            jabatan?: { kode_jab?: string | null; jabatan?: string | null };
          }[]
        | {
            ukk_id?: string | null;
            unit_kerja_detail?: {
              seksi?: {
                id?: string | null;
                name?: string | null;
                nama_sek?: string | null;
              };
              bagian?: {
                id?: string | null;
                name?: string | null;
                nama_bag?: string | null;
              };
              divisi?: {
                id?: string | null;
                name?: string | null;
                nama_div?: string | null;
              };
              deputi?: {
                id?: string | null;
                name?: string | null;
                nama_dep?: string | null;
              };
              direktur?: {
                id?: string | null;
                name?: string | null;
                nama_dir?: string | null;
              };
            };
            jam_mengajar?:
              | {
                  jam_mengajar?: string | null;
                  mapel?: { nama_mapel?: string | null };
                }[]
              | {
                  jam_mengajar?: string | null;
                  mapel?: { nama_mapel?: string | null };
                };
            jabatan?: { kode_jab?: string | null; jabatan?: string | null };
          };
    };

    type FilteredItem = {
      id: string;
      jam_mengajar: string;
      mengajar_mapel: string;
      lokasi_kerja: { id: string | null; name: string | null };
      jabatan?: { id: string | null; name: string | null };
    };

    const filteredData: FilteredItem[] = [];

    const unitKerjaList = Array.isArray(plainData.unit_kerja_karyawan)
      ? plainData.unit_kerja_karyawan
      : plainData.unit_kerja_karyawan
        ? [plainData.unit_kerja_karyawan]
        : [];

    const pickNama = (obj?: {
      name?: string | null;
      nama_sek?: string | null;
      nama_bag?: string | null;
      nama_div?: string | null;
      nama_dep?: string | null;
      nama_dir?: string | null;
    }) => {
      return (
        obj?.name ??
        obj?.nama_sek ??
        obj?.nama_bag ??
        obj?.nama_div ??
        obj?.nama_dep ??
        obj?.nama_dir ??
        ''
      );
    };

    unitKerjaList.forEach(item => {
      const detail = item.unit_kerja_detail;

      const lokasi =
        detail?.seksi?.id && detail.seksi.id !== 'nnn'
          ? {
              id: detail.seksi.id,
              name: pickNama(detail.seksi),
            }
          : detail?.bagian?.id && detail.bagian.id !== 'nnn'
            ? {
                id: detail.bagian.id,
                name: pickNama(detail.bagian),
              }
            : detail?.divisi?.id && detail.divisi.id !== 'nnn'
              ? {
                  id: detail.divisi.id,
                  name: pickNama(detail.divisi),
                }
              : detail?.deputi?.id && detail.deputi.id !== 'nnn'
                ? {
                    id: detail.deputi.id,
                    name: pickNama(detail.deputi),
                  }
                : detail?.direktur
                  ? {
                      id: detail.direktur.id ?? '',
                      name: pickNama(detail.direktur),
                    }
                  : { id: '', name: '' };

      const jabatan = item.jabatan
        ? {
            id: item.jabatan.kode_jab ?? null,
            name: item.jabatan.jabatan ?? null,
          }
        : undefined;

      const jamMengajarList = Array.isArray(item.jam_mengajar)
        ? item.jam_mengajar
        : item.jam_mengajar
          ? [item.jam_mengajar]
          : [];

      if (jamMengajarList.length > 0) {
        jamMengajarList.forEach(j => {
          filteredData.push({
            id: item.ukk_id ?? '',
            jam_mengajar: j.jam_mengajar ?? '',
            mengajar_mapel: j.mapel?.nama_mapel ?? '',
            lokasi_kerja: lokasi,
            jabatan,
          });
        });
      } else {
        filteredData.push({
          id: item.ukk_id ?? '',
          jam_mengajar: '',
          mengajar_mapel: '',
          lokasi_kerja: lokasi,
          jabatan,
        });
      }
    });

    return ok(
      c,
      {
        id_karyawan: plainData.id_karyawan ?? id,
        nik: plainData.nik ?? null,
        nama_lengkap: plainData.nama_lengkap ?? null,
        tgl_join_penabur: plainData.tgl_join_penabur ?? null,
        tgl_join_penabur_jkt: plainData.tgl_join_penabur_jkt ?? null,
        tanggal_inactive: plainData.tanggal_inactive ?? null,
        unit_kerja: filteredData,
      },
      `Berhasil ambil data karyawan: ${id}`
    );
  } catch (err) {
    await logError(
      `Gagal ambil unit kerja karyawan id=${c.req.param('id')}`,
      err
    );

    if (err instanceof Error && 'status' in err) {
      const e = err as Error & { status?: number };
      if (e.status === 400) return badRequest(c, e.message);
      if (e.status === 404) return notFound(c, e.message);
      return badRequest(c, e.message);
    }

    return badRequest(c, 'Terjadi kesalahan saat mengambil data unit kerja');
  }
};

export const direktur = async (c: Context) => {
  const service = new PrsKaryawanService();

  try {
    await logInfo('Request list direktur');

    const data = await service.direktur();

    const result = data.map(row => {
      const plain = row.get({ plain: true }) as any;

      const unitKerja: any[] = [];

      plain.unit_kerja_karyawan?.forEach((item: any) => {
        const detail = item.unit_kerja_detail as any;

        const lokasi = detail?.seksi?.id
          ? detail.seksi
          : detail?.bagian?.id
            ? detail.bagian
            : detail?.divisi?.id
              ? detail.divisi
              : detail?.deputi?.id
                ? detail.deputi
                : detail?.direktur
                  ? detail.direktur
                  : { id: null, name: null };

        if (item.jam_mengajar?.length) {
          item.jam_mengajar.forEach((j: any) => {
            unitKerja.push({
              id: item.ukk_id ?? null,
              jam_mengajar: j.jam_mengajar ?? '',
              mengajar_mapel: j.mapel?.nama_mapel ?? '',
              lokasi_kerja: lokasi,
              jabatan: item.jabatan ?? null,
            });
          });
        } else {
          unitKerja.push({
            id: item.ukk_id ?? null,
            jam_mengajar: '',
            mengajar_mapel: '',
            lokasi_kerja: lokasi,
            jabatan: item.jabatan ?? null,
          });
        }
      });

      return {
        id_karyawan: plain.id_karyawan ?? null,
        nik: plain.nik ?? null,
        nama_lengkap: plain.nama_lengkap ?? null,
        unit_kerja: unitKerja,
      };
    });

    return ok(c, result, 'Berhasil ambil list direktur');
  } catch (err) {
    await logError('Gagal ambil data direktur', err);
    return badRequest(c, 'Terjadi kesalahan');
  }
};

type PlainObject = Record<string, unknown>;

// ✅ Ambil data keluarga karyawan by id

export const getKeluargaByKaryawanId = async (c: Context) => {
  const service = new PrsKaryawanService();
  const id = c.req.param('id');

  try {
    await logInfo(`Request getKeluargaByKaryawanId dengan id_karyawan = ${id}`);

    const data = await service.getKeluargaByKaryawanId(id);

    if (!data) {
      await logInfo(`Karyawan dengan ID ${id} tidak ditemukan`);
      return notFound(c, 'Karyawan tidak ditemukan');
    }

    // ubah hasil Sequelize ke object biasa
    const plainData: PlainObject =
      typeof (data as { toJSON?: () => unknown }).toJSON === 'function'
        ? ((data as { toJSON: () => unknown }).toJSON() as PlainObject)
        : (data as unknown as PlainObject);

    const filteredData: Record<string, unknown> = {};

    const Pemisah = {
      id: 'keluarga_karyawan.id',
      nama_lengkap: 'keluarga_karyawan.nama_lengkap',
      tanggal_lahir: 'keluarga_karyawan.tanggal_lahir',
      kewarganegaraan: 'keluarga_karyawan.kewarganegaraan',
      flag_status: 'keluarga_karyawan.flag_status',
      berpisah: 'keluarga_karyawan.berpisah',
      gender: 'keluarga_karyawan.gender',
      hubungan: 'keluarga_karyawan.hubungan',
      no_telp: 'keluarga_karyawan.no_telp',
      keterangan: 'keluarga_karyawan.keterangan',
      tanggungan_medical: 'keluarga_karyawan.tanggungan_medical',
      kebijakan_khusus_medical: 'keluarga_karyawan.kebijakan_khusus_medical',
      agama: 'keluarga_karyawan.agama_detail.agama',
    } as const;

    for (const key of Object.keys(plainData)) {
      const splitKey = key.split('.');
      const lastKey = splitKey[splitKey.length - 1];

      // Gabungkan field "kode" dan "nama" jadi object {id, nama}
      if (lastKey === 'kode') {
        const parentKey = splitKey[splitKey.length - 2] as keyof typeof Pemisah;

        if (parentKey && Pemisah[parentKey]) {
          const fieldNama =
            splitKey.slice(0, -1).join('.') + '.' + Pemisah[parentKey];

          filteredData[parentKey] = {
            id: plainData[key],
            nama: plainData[fieldNama] ?? null,
          };
          continue;
        }
      }

      // Field utama tanpa nested
      if (!key.includes('.')) {
        filteredData[key] = plainData[key];
      }

      // Beberapa field penting dari relasi
      if (key.endsWith('nama_lengkap'))
        filteredData['nama_lengkap_keluarga'] = plainData[key];
      if (key.endsWith('tanggal_lahir'))
        filteredData['tanggal_lahir'] = plainData[key];
      if (key.endsWith('gender')) filteredData['gender'] = plainData[key];
      if (key.endsWith('no_telp')) filteredData['no_telp'] = plainData[key];
      if (key.endsWith('keterangan'))
        filteredData['keterangan'] = plainData[key];
      if (key.endsWith('tanggungan_medical'))
        filteredData['tanggungan_medical'] = plainData[key];
      if (key.endsWith('kebijakan_khusus_medical'))
        filteredData['kebijakan_khusus_medical'] = plainData[key];
      if (key.endsWith('agama')) filteredData['agama'] = plainData[key];
    }

    await logInfo(`Berhasil ambil data keluarga untuk id_karyawan = ${id}`);
    return ok(c, filteredData, `Berhasil ambil data keluarga: ${id}`);
  } catch (err: unknown) {
    await logError(`Gagal ambil data keluarga untuk id_karyawan = ${id}`, err);

    if (err instanceof Error && 'status' in err) {
      const e = err as Error & { status?: number };
      if (e.status === 400) return badRequest(c, e.message);
      if (e.status === 404) return notFound(c, e.message);
      return badRequest(c, e.message);
    }

    return badRequest(c, 'Terjadi kesalahan tidak terduga');
  }
};

// ✅ Ambil semua status dengan jumlah karyawan
export const getAllStatusWithKaryawan = async (c: Context) => {
  const service = new PrsKaryawanService();
  try {
    await logInfo('Memulai ambil semua data status karyawan beserta karyawan');

    const data = await service.getAllWithKaryawan();

    if (!data || data.length === 0) {
      await logWarn('Data status karyawan beserta karyawan kosong', null);
    } else {
      await logInfo(
        `Berhasil ambil ${data.length} data status karyawan dan jumlah karyawan`,
        null
      );
    }

    return ok(c, data);
  } catch (err: unknown) {
    await logError('Gagal ambil data status karyawan beserta karyawan', err);
    return badRequest(
      c,
      'Terjadi kesalahan saat mengambil data status karyawan'
    );
  }
};
interface UnitKerjaRecord {
  [key: string]: string | null | undefined;
}

// ✅ Tipe akhir data yang dikembalikan ke client
interface UnitKerjaResponse {
  id_karyawan: string;
  nik: string | null;
  email_penabur: string | null;
  uk_id: string | null;
  kode_seksi: string | null;
  kode_bagian: string | null;
  kode_divisi: string | null;
  lokasi_penggajian: string | null;
}

export const getUnitKerjaByIdKaryawan = async (
  c: Context
): Promise<Response> => {
  const service = new PrsKaryawanService();

  try {
    const idKaryawan = c.req.param('id_karyawan');

    if (!idKaryawan) {
      await logWarn('Query parameter "id_karyawan" tidak diberikan');
      return badRequest(c, 'Query parameter "id_karyawan" diperlukan');
    }

    await logInfo(
      `Memulai ambil data unit kerja untuk id_karyawan: ${idKaryawan}`
    );

    const data = await service.getUnitKerjaByIdKaryawan(idKaryawan);

    if (!data) {
      await logWarn(
        `Data unit kerja tidak ditemukan untuk id_karyawan: ${idKaryawan}`
      );
      return ok(c, {}, 'Data unit kerja tidak ditemukan');
    }

    const plainData: UnitKerjaRecord =
      typeof (data as { toJSON?: () => unknown }).toJSON === 'function'
        ? ((data as { toJSON: () => unknown }).toJSON() as UnitKerjaRecord)
        : (data as unknown as UnitKerjaRecord);

    // ✅ Buat response terstruktur dengan tipe aman
    const filteredData: UnitKerjaResponse = {
      id_karyawan: (plainData['karyawan_id'] as string) ?? idKaryawan,
      nik: (plainData['nik'] as string) ?? null,
      email_penabur: (plainData['email_penabur'] as string) ?? null,
      uk_id: (plainData['unit_kerja_detail.uk_id'] as string) ?? null,
      kode_seksi: (plainData['unit_kerja_detail.kode_seksi'] as string) ?? null,
      kode_bagian:
        (plainData['unit_kerja_detail.kode_bagian'] as string) ?? null,
      kode_divisi:
        (plainData['unit_kerja_detail.kode_divisi'] as string) ?? null,
      lokasi_penggajian: (plainData['lokasi_penggajian'] as string) ?? null,
    };

    await logInfo(
      `Berhasil ambil data unit kerja untuk id_karyawan: ${idKaryawan}`
    );

    return ok(
      c,
      filteredData,
      `Berhasil ambil data unit kerja untuk id_karyawan ${idKaryawan}`
    );
  } catch (err: unknown) {
    await logError(
      `Gagal ambil data unit kerja untuk id_karyawan: ${c.req.param('id_karyawan')}`,
      err
    );

    return badRequest(c, 'Terjadi kesalahan saat mengambil data unit kerja');
  }
};

export const getDetailMengajarById = async (c: Context): Promise<Response> => {
  const service = new PrsKaryawanService();
  try {
    const email = c.req.query('id_karyawan');
    if (!email) return badRequest(c, 'Query parameter "email" diperlukan');

    const data = await service.getDetailMengajarByID(email);
    return ok(c, data);
  } catch (err: unknown) {
    if (err instanceof Error && 'status' in err) {
      const e = err as Error & { status?: number };
      if (e.status === 400) return badRequest(c, e.message);
      if (e.status === 404) return notFound(c, e.message);
      return badRequest(c, e.message);
    }
    return badRequest(c, 'Terjadi kesalahan tidak terduga');
  }
};

export const getKontrakByEmail = async (c: Context): Promise<Response> => {
  const service = new PrsKaryawanService();
  try {
    const email = c.req.query('email');

    if (!email) {
      await logWarn('Parameter "email" wajib diisi', null);
      return badRequest(c, 'Parameter email wajib diisi');
    }

    await logInfo(`Memulai ambil data kontrak untuk email: ${email}`);

    const data = await service.getKontrakByEmail(email);

    if (!data) {
      await logWarn(`Data kontrak tidak ditemukan untuk email: ${email}`, null);
      return notFound(c, `Data kontrak tidak ditemukan untuk email: ${email}`);
    } else {
      await logInfo(`Berhasil ambil data kontrak untuk email: ${email}`, null);
      return ok(c, data, 'Data kontrak ditemukan');
    }
  } catch (err: unknown) {
    await logError(
      `Gagal ambil data kontrak untuk email: ${c.req.query('email')}`,
      err
    );
    return badRequest(c, 'Terjadi kesalahan saat mengambil data kontrak');
  }
};

export const getAlamatLengkapByIdKaryawan = async (
  c: Context
): Promise<Response> => {
  const service = new PrsKaryawanService();

  const idKaryawan = c.req.param('id');

  if (!idKaryawan) {
    return badRequest(c, 'Parameter "id_karyawan" diperlukan');
  }

  const data = await service.getAlamatLengkapByIdKaryawan(idKaryawan);

  if (!data) {
    return notFound(c, 'Alamat lengkap tidak ditemukan');
  }

  const plainData: PlainRecord = toPlainRecord(data);

  const toStringOrNull = (value: unknown): string | null =>
    value != null ? String(value) : null;

  const extractAlamat = (prefix: string, idAlias: string): AlamatDetail => ({
    id: toStringOrNull(plainData[`${prefix}.${idAlias}`]),
    alamat: toStringOrNull(plainData[`${prefix}.alamat`]),
    rt: toStringOrNull(plainData[`${prefix}.rt`]),
    rw: toStringOrNull(plainData[`${prefix}.rw`]),
    kode_pos: toStringOrNull(plainData[`${prefix}.kode_pos`]),
    status_tempat_tinggal: toStringOrNull(
      plainData[`${prefix}.status_tempat_tinggal`]
    ),
    kelurahan: {
      id: toStringOrNull(plainData[`${prefix}.kelurahan.id`]),
      nama: toStringOrNull(plainData[`${prefix}.kelurahan.nama`]),
    },
    kecamatan: {
      id: toStringOrNull(plainData[`${prefix}.kelurahan.kecamatan.id`]),
      nama: toStringOrNull(plainData[`${prefix}.kelurahan.kecamatan.nama`]),
    },
    kota: {
      id: toStringOrNull(plainData[`${prefix}.kelurahan.kecamatan.kota.id`]),
      nama: toStringOrNull(
        plainData[`${prefix}.kelurahan.kecamatan.kota.nama`]
      ),
    },
    provinsi: {
      id: toStringOrNull(
        plainData[`${prefix}.kelurahan.kecamatan.kota.provinsi.id`]
      ),
      nama: toStringOrNull(
        plainData[`${prefix}.kelurahan.kecamatan.kota.provinsi.nama`]
      ),
    },
  });

  const result = {
    alamatTempatTinggalDetail: extractAlamat(
      'alamat_tempat_tinggal_detail',
      'alamatTempatTinggalId'
    ),
    alamatKtpDetail: extractAlamat('alamat_ktp_detail', 'alamatKtpId'),
  };

  return ok(
    c,
    result,
    `Berhasil ambil data alamat lengkap untuk id_karyawan ${idKaryawan}`
  );
};

interface PendidikanResponse {
  id?: string;
  id_karyawan?: string;
  nama_lengkap?: string;
  email_penabur?: string;
  jurusan?: string;
  tahun_kelulusan?: string;
  ipk?: string;
  tingkat?: string;
  univ?: {
    id?: string;
    nama?: string;
  };
}

// type PlainRow = Record<string, unknown>;

// const toStringOrNull = (value: unknown): string | null =>
//   value !== undefined && value !== null ? String(value) : null;

export const getDetailPendidikanByIdKaryawan = async (
  c: Context
): Promise<Response> => {
  const service = new PrsKaryawanService();

  // helper lokal (digabung)
  const toStringOrUndefined = (v: unknown): string | undefined =>
    v == null ? undefined : String(v);

  try {
    const id_karyawan = c.req.param('id_karyawan');
    if (!id_karyawan) {
      await logWarn('Parameter "id_karyawan" wajib diisi');
      return badRequest(c, 'Parameter id_karyawan wajib diisi');
    }

    await logInfo(
      `🎓 Memulai ambil detail pendidikan untuk id_karyawan: ${id_karyawan}`
    );

    /**
     * ⚠️ WAJIB RAW QUERY
     * sequelize.query(...) / findAll({ raw: true })
     */
    const data = (await service.getDetailPendidikanByIdKaryawan(
      id_karyawan
    )) as unknown as Record<string, unknown>[];

    if (!data || data.length === 0) {
      await logWarn(
        `Detail pendidikan tidak ditemukan untuk id_karyawan: ${id_karyawan}`
      );
      return notFound(
        c,
        `Detail pendidikan tidak ditemukan untuk id_karyawan: ${id_karyawan}`
      );
    }

    // ===========================
    // 🔥 FORMAT DATA (TS AMAN)
    // ===========================
    const filteredData: PendidikanResponse[] = data.map(item => ({
      id: toStringOrUndefined(item['pendidikan.rpk_id']),
      id_karyawan: toStringOrUndefined(item['id_karyawan']),
      nama_lengkap: toStringOrUndefined(item['nama_lengkap']),
      email_penabur: toStringOrUndefined(item['email_penabur']),
      jurusan: toStringOrUndefined(item['pendidikan.jurusan']),
      tahun_kelulusan: toStringOrUndefined(item['pendidikan.tahun_kelulusan']),
      tingkat: toStringOrUndefined(item['pendidikan.tingkat']),
      ipk: toStringOrUndefined(item['pendidikan.ipk']),

      univ: {
        id: toStringOrUndefined(item['pendidikan.jenjang.id']),
        nama: toStringOrUndefined(item['pendidikan.jenjang.nama']),
      },
    }));

    await logInfo(
      `✅ Berhasil ambil detail pendidikan untuk id_karyawan: ${id_karyawan}`
    );

    return ok(
      c,
      filteredData,
      `Berhasil ambil detail pendidikan untuk id_karyawan: ${id_karyawan}`
    );
  } catch (err: unknown) {
    await logError(
      `❌ Gagal ambil detail pendidikan untuk id_karyawan: ${c.req.param(
        'id_karyawan'
      )}`,
      err
    );

    if (err instanceof Error && 'status' in err) {
      const e = err as Error & { status?: number };
      if (e.status === 400) return badRequest(c, e.message);
      if (e.status === 404) return notFound(c, e.message);
    }

    return badRequest(c, 'Terjadi kesalahan saat mengambil detail pendidikan');
  }
};

export const getKontakDaruratByIdKaryawan = async (c: Context) => {
  const service = new PrsKaryawanService();

  try {
    const id = c.req.param('id');
    if (!id) {
      await logWarn('Parameter "id" wajib diisi');
      return badRequest(c, 'Parameter id wajib diisi');
    }

    await logInfo(`📞 Memulai ambil kontak darurat untuk id_karyawan: ${id}`);

    const data = await service.getKontakDaruratByIdKaryawan(id);

    if (!data || (Array.isArray(data) && data.length === 0)) {
      await logWarn(
        `⚠️ Kontak darurat tidak ditemukan untuk id_karyawan: ${id}`
      );
      return notFound(
        c,
        `Kontak darurat tidak ditemukan untuk id_karyawan: ${id}`
      );
    }
    // Helper type-safe untuk convert Sequelize instance ke plain object
    function toPlain<T extends object>(
      data: T | { toJSON: () => T }
    ): Record<string, unknown> {
      return typeof (data as { toJSON?: () => T }).toJSON === 'function'
        ? ((data as { toJSON: () => T }).toJSON() as Record<string, unknown>)
        : (data as Record<string, unknown>);
    }
    // 🧩 Pastikan hasil Sequelize (instance atau array) diubah ke objek biasa
    const plainDataArray: Record<string, unknown>[] = Array.isArray(data)
      ? data.map(item => toPlain(item))
      : [toPlain(data)];

    // 🧮 Mapping hasil ke bentuk yang bersih
    const filteredData: KontakDaruratRecord[] = plainDataArray.map(
      (row: Record<string, unknown>) => ({
        karyawan_id: (row['kontak_darurat.karyawan_id'] ??
          row['nama_kondar']) as string,
        id: (row['kontak_darurat.id'] ?? row['nama_kondar']) as string,
        nama_kondar: (row['kontak_darurat.nama_kondar'] ??
          row['nama_kondar']) as string,
        hubungan_kondar: (row['kontak_darurat.hubungan_kondar'] ??
          row['hubungan_kondar']) as string,
        telp_darurat: (row['kontak_darurat.telp_darurat'] ??
          row['telp_darurat']) as string,
        no_hp: (row['kontak_darurat.no_hp'] ?? row['alamat_kondar']) as string,
        alamat_kondar: (row['kontak_darurat.alamat_kondar'] ??
          row['alamat_kondar']) as string,
      })
    );

    await logInfo(
      `✅ Berhasil ambil ${filteredData.length} kontak darurat untuk id_karyawan: ${id}`
    );
    return ok(
      c,
      filteredData,
      `Berhasil ambil kontak darurat untuk karyawan ${id}`
    );
  } catch (err: unknown) {
    await logError(
      `❌ Gagal ambil kontak darurat untuk id_karyawan: ${c.req.param('id')}`,
      err
    );

    if (err instanceof Error) {
      return badRequest(
        c,
        err.message || 'Terjadi kesalahan saat mengambil kontak darurat'
      );
    }

    return badRequest(
      c,
      'Terjadi kesalahan tak terduga saat mengambil kontak darurat'
    );
  }
};

export const getUnitKerjaWithDivisiBagianSeksi = async (
  c: Context
): Promise<Response> => {
  const service = new PrsKaryawanService();
  try {
    const email = c.req.query('email_penabur');

    if (!email) {
      await logWarn('Query parameter "email_penabur" tidak diberikan', null);
      return badRequest(c, 'Query parameter email_penabur diperlukan');
    }

    await logInfo(
      `Memulai ambil unit kerja dengan divisi/bagian/seksi untuk email_penabur: ${email}`
    );

    const data = await service.getUnitKerjaWithDivisiBagianSeksiByEmail(
      email as string
    );

    if (!data) {
      await logWarn(
        `Data unit kerja dengan divisi/bagian/seksi tidak ditemukan untuk email_penabur: ${email}`,
        null
      );
      return notFound(
        c,
        `Data unit kerja dengan divisi/bagian/seksi tidak ditemukan untuk email_penabur: ${email}`
      );
    } else {
      await logInfo(
        `Berhasil ambil unit kerja dengan divisi/bagian/seksi untuk email_penabur: ${email}`,
        null
      );
      return ok(c, data);
    }
  } catch (err: unknown) {
    await logError(
      `Gagal ambil unit kerja dengan divisi/bagian/seksi untuk email_penabur: ${c.req.query('email_penabur')}`,
      err
    );
    return badRequest(
      c,
      'Terjadi kesalahan saat mengambil data unit kerja dengan divisi/bagian/seksi'
    );
  }
};
export const getKaryawanWithDokumenByEmail = async (
  c: Context
): Promise<Response> => {
  const service = new PrsKaryawanService();
  try {
    const emailParam = c.req.param('email');
    const emailSchema = z.string().email('Format email tidak valid');
    const email = emailSchema.parse(emailParam);

    await logInfo(
      `Memulai ambil data karyawan beserta dokumen untuk email: ${email}`
    );

    const data = await service.getKaryawanWithDokumenByEmail(email);

    if (!data) {
      await logWarn(
        `Data karyawan beserta dokumen tidak ditemukan untuk email: ${email}`,
        null
      );
      return notFound(c, 'Data karyawan dan dokumen tidak ditemukan');
    } else {
      await logInfo(
        `Berhasil ambil data karyawan beserta dokumen untuk email: ${email}`,
        null
      );
      return ok(c, data, 'Data karyawan dan dokumen ditemukan');
    }
  } catch (err: unknown) {
    if (err instanceof ZodError) {
      await logWarn(
        `Validasi gagal untuk email: ${c.req.param('email')}`,
        err.issues
      );
      return badRequest(c, 'Validasi gagal', err.issues);
    }

    await logError(
      `Gagal ambil data karyawan beserta dokumen untuk email: ${c.req.param('email')}`,
      err
    );
    return notFound(c, 'Gagal mengambil data');
  }
};
export const getDetailKaryawan = async (c: Context): Promise<Response> => {
  const service = new PrsKaryawanService();

  try {
    const id = c.req.param('id');

    if (!id) {
      await logWarn('Parameter "id" tidak diberikan', null);
      return badRequest(c, 'Parameter id wajib diisi');
    }

    await logInfo(`Memulai ambil detail karyawan untuk id = ${id}`);

    const data = await service.getDetailKaryawan(id);

    await logInfo(`Berhasil ambil detail karyawan untuk id = ${id}`);

    return ok(c, data, `Berhasil ambil detail karyawan untuk id = ${id}`);
  } catch (err: unknown) {
    await logError(
      `Gagal ambil detail karyawan untuk id = ${c.req.param('id')}`,
      err
    );

    if (err instanceof Error && 'status' in err) {
      const e = err as Error & { status?: number };
      if (e.status === 400) return badRequest(c, e.message);
      if (e.status === 404) return notFound(c, e.message);
    }

    return badRequest(c, 'Terjadi kesalahan saat mengambil detail karyawan');
  }
};
export const getInformasiPenggajian = async (c: Context): Promise<Response> => {
  const service = new PrsKaryawanService();

  try {
    const id = c.req.param('id');

    if (!id) {
      await logWarn('Parameter "id" tidak diberikan', null);
      return badRequest(c, 'Parameter id wajib diisi');
    }

    await logInfo(`Memulai ambil informasi penggajian untuk id = ${id}`);

    const data = await service.getInformasiPenggajian(id);

    await logInfo(`Berhasil ambil informasi penggajian untuk id = ${id}`);

    return ok(c, data, `Berhasil ambil informasi penggajian untuk id = ${id}`);
  } catch (err: unknown) {
    await logError(
      `Gagal ambil informasi penggajian untuk id = ${c.req.param('id')}`,
      err
    );

    if (err instanceof Error && 'status' in err) {
      const e = err as Error & { status?: number };
      if (e.status === 400) return badRequest(c, e.message);
      if (e.status === 404) return notFound(c, e.message);
    }

    return badRequest(
      c,
      'Terjadi kesalahan saat mengambil informasi penggajian'
    );
  }
};

export const updateAlamat = async (c: Context): Promise<Response> => {
  const service = new PrsKaryawanService();

  const idKaryawan = c.req.param('id_karyawan');
  if (!idKaryawan) {
    return badRequest(c, 'Parameter "id_karyawan" diperlukan');
  }

  // ✅ FIX: beri generic agar TIDAK unknown
  const body = await c.req.json<Partial<PrsKaryawanAlamatDTO>>();

  // 1️⃣ UPDATE alamat
  await service.updateAlamat(idKaryawan, body);

  // 2️⃣ Ambil ulang data alamat lengkap
  const data = await service.getAlamatLengkapByIdKaryawan(idKaryawan);
  if (!data) {
    return notFound(c, 'Alamat karyawan tidak ditemukan');
  }

  const plainData: PlainRecord = toPlainRecord(data);

  const extractAlamat = (prefix: string, idAlias: string) => ({
    id: plainData[`${prefix}.${idAlias}`] ?? null,
    alamat: plainData[`${prefix}.alamat`] ?? null,
    rt: plainData[`${prefix}.rt`] ?? null,
    rw: plainData[`${prefix}.rw`] ?? null,
    kode_pos: plainData[`${prefix}.kode_pos`] ?? null,
    status_tempat_tinggal: plainData[`${prefix}.status_tempat_tinggal`] ?? null,
    kelurahan: {
      id: plainData[`${prefix}.kelurahan.id`] ?? null,
      nama: plainData[`${prefix}.kelurahan.nama`] ?? null,
    },
    kecamatan: {
      id: plainData[`${prefix}.kelurahan.kecamatan.id`] ?? null,
      nama: plainData[`${prefix}.kelurahan.kecamatan.nama`] ?? null,
    },
    kota: {
      id: plainData[`${prefix}.kelurahan.kecamatan.kota.id`] ?? null,
      nama: plainData[`${prefix}.kelurahan.kecamatan.kota.nama`] ?? null,
    },
    provinsi: {
      id: plainData[`${prefix}.kelurahan.kecamatan.kota.provinsi.id`] ?? null,
      nama:
        plainData[`${prefix}.kelurahan.kecamatan.kota.provinsi.nama`] ?? null,
    },
  });

  return ok(
    c,
    {
      id_karyawan: idKaryawan,
      alamatTempatTinggalDetail: extractAlamat(
        'alamat_tempat_tinggal_detail',
        'alamatTempatTinggalId'
      ),
      alamatKtpDetail: extractAlamat('alamat_ktp_detail', 'alamatKtpId'),
    },
    'Alamat karyawan berhasil diperbarui'
  );
};

// export const updateAlamat = async (c: Context) => {
//   try {
//     const id_karyawan = c.req.param("id_karyawan");
//     const body = await c.req.json();

//     const service = new PrsKaryawanService();
//     const result = await service.updateAlamat(id_karyawan, body);

//     return ok(c, result.data.result, result.message);
//   } catch (err) {
//     console.error("updateAlamat error:", err);
//     return badRequest(c, "Terjadi kesalahan saat memperbarui alamat karyawan", {
//       error: err.message,
//     });
//   }
// };

export const updateKontakDarurat = async (c: Context) => {
  const service = new PrsKaryawanService();

  const idKaryawan = c.req.param('id_karyawan');
  const idKontak = c.req.param('id');

  if (!idKaryawan || !idKontak) {
    return badRequest(
      c,
      'Parameter "id_karyawan" dan "id" (id kontak darurat) diperlukan'
    );
  }

  // ⬇️ ambil body mentah
  const rawBody = (await c.req.json()) as Partial<PrsKontakDarurat>;

  // 🔥 NORMALISASI: null → undefined
  const body = Object.fromEntries(
    Object.entries(rawBody).map(([key, value]) => [
      key,
      value === null ? undefined : value,
    ])
  ) as {
    nama_kondar?: string;
    hubungan_kondar?: string;
    alamat_kondar?: string;
    telp_darurat?: string;
    email?: string;
    kategori_kontak?: string;
    no_hp?: string;
  };

  // 🔥 service return langsung entity
  const updatedData = await service.updateKontakDaruratById(
    idKaryawan,
    idKontak,
    body
  );

  if (!updatedData) {
    return notFound(c, 'Kontak darurat tidak ditemukan');
  }

  return ok(c, updatedData, 'Kontak darurat berhasil diperbarui');
};

export const updateKeluarga = async (c: Context) => {
  const service = new PrsKaryawanService();

  const idKaryawan = c.req.param('id_karyawan');
  const idKeluarga = c.req.param('id');

  if (!idKaryawan || !idKeluarga) {
    return badRequest(c, 'Parameter "id_karyawan" dan "id" diperlukan');
  }

  // 🔥 Body dari request (JSON selalu primitive)
  const rawBody = (await c.req.json()) as Record<string, unknown>;

  // 🔥 Normalisasi & mapping ke bentuk yang DIHARAPKAN service
  const body = {
    ...rawBody,

    // ⬇️ PENTING: Date HARUS string
    tanggal_lahir:
      rawBody.tanggal_lahir != null ? String(rawBody.tanggal_lahir) : undefined,

    // ⬇️ numeric yang boleh null
    agama: rawBody.agama != null ? Number(rawBody.agama) : undefined,
  };

  const result = await service.updateKeluargaById(idKaryawan, idKeluarga, body);

  if (!result.success) {
    return badRequest(c, result.message || 'Gagal memperbarui data keluarga');
  }

  const updated = await service.getKeluargaByKaryawanIdAndId(
    idKaryawan,
    idKeluarga
  );

  if (!updated) {
    return notFound(c, 'Data keluarga tidak ditemukan');
  }

  return ok(c, updated, 'Data keluarga berhasil diperbarui');
};

export const getKaryawanAdditionalById = async (c: Context) => {
  const service = new PrsKaryawanService();
  const idKaryawan = c.req.param('id_karyawan');

  if (!idKaryawan) {
    return badRequest(c, 'Parameter id wajib diisi');
  }

  const result = await service.getAdditionalById(idKaryawan);

  if (!result?.data) {
    return notFound(c, 'Data tidak ditemukan');
  }

  return ok(c, result.data, 'Berhasil ambil data tambahan karyawan');
};

export const updateAdditional = async (c: Context) => {
  const service = new PrsKaryawanService();
  const historyService = new HistoryService(); // ✅ tambah

  const id_karyawan = c.req.param('id_karyawan');
  if (!id_karyawan) {
    return c.json(
      { success: false, message: 'Parameter "id_karyawan" wajib dikirim' },
      400
    );
  }

  const contentType = c.req.header('content-type') ?? '';
  const payload: Record<string, unknown> = {};
  let file: File | null = null;

  if (contentType.includes('multipart/form-data')) {
    const form = await c.req.formData();
    file = form.get('foto') as File | null;

    form.forEach((value, key) => {
      if (key === 'foto') return;
      if (typeof value === 'string') {
        payload[key] = value;
      }
    });
  } else if (contentType.includes('application/json')) {
    const body = await c.req.json<Record<string, unknown>>();

    Object.entries(body).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        payload[key] = value;
      }
    });
  } else {
    return c.json({ success: false, message: 'Unsupported Content-Type' }, 400);
  }

  const fotoBase64Raw =
    typeof payload.foto_base64 === 'string'
      ? payload.foto_base64
      : typeof payload.foto === 'string' && payload.foto.startsWith('data:')
        ? payload.foto
        : null;

  if (fotoBase64Raw) {
    const matched = fotoBase64Raw.match(/^data:(.+?);base64,(.+)$/);

    if (!matched) {
      return c.json(
        { success: false, message: 'Format foto base64 tidak valid' },
        400
      );
    }

    const [, mimeType, base64Content] = matched;
    const filenameHint =
      typeof payload.foto_filename === 'string' ? payload.foto_filename : '';
    const filenameExt = path.extname(filenameHint).toLowerCase();
    const mimeExtensions: Record<string, string> = {
      'image/jpeg': '.jpg',
      'image/jpg': '.jpg',
      'image/png': '.png',
      'image/webp': '.webp',
      'image/gif': '.gif',
    };
    const ext = filenameExt || mimeExtensions[mimeType] || '.bin';
    const filename = `${uuidv4()}${ext}`;
    const uploadDir = path.join('uploads', 'karyawan');
    const filepath = path.join(uploadDir, filename);

    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(filepath, Buffer.from(base64Content, 'base64'));

    payload.foto = `uploads/karyawan/${filename}`;
    delete payload.foto_base64;
    delete payload.foto_filename;
  }

  if (file && file.name) {
    const ext = path.extname(file.name);
    const filename = `${uuidv4()}${ext}`;
    const uploadDir = path.join('uploads', 'karyawan');
    const filepath = path.join(uploadDir, filename);

    await fs.mkdir(uploadDir, { recursive: true });
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filepath, buffer);

    payload.foto = `uploads/karyawan/${filename}`;
  }

  if (!payload || Object.keys(payload).length === 0) {
    return c.json(
      { success: false, message: 'Payload tidak boleh kosong' },
      400
    );
  }

  // =====================================================
  // AMBIL DATA LAMA (UNTUK HISTORY)
  // =====================================================
  const beforeUpdate = await service.getById(id_karyawan);
  if (!beforeUpdate) {
    return c.json({ success: false, message: 'Karyawan tidak ditemukan' }, 404);
  }

  const beforeUpdatePlain: Record<string, unknown> =
    typeof (beforeUpdate as { toJSON?: () => unknown }).toJSON === 'function'
      ? ((beforeUpdate as { toJSON: () => unknown }).toJSON() as Record<
          string,
          unknown
        >)
      : (beforeUpdate as unknown as Record<string, unknown>);

  // =====================================================
  // HISTORY KHUSUS: kode_golongan (JIKA ADA DI PAYLOAD)
  // =====================================================
  const newGolRaw = payload.kode_golongan;

  if (newGolRaw !== undefined && newGolRaw !== null) {
    const newGol = String(newGolRaw).trim();
    const oldGol = String(beforeUpdatePlain.kode_golongan ?? '').trim();

    if (oldGol !== newGol) {
      await historyService.createHistory({
        id_karyawan,
        tipe_perubahan: `kode_golongan: ${newGol}`,
        value_lama: `kode_golongan: ${oldGol}`,
      });
    }
  }

  const newFotoRaw = payload.foto;
  if (newFotoRaw !== undefined && newFotoRaw !== null) {
    const newFoto = String(newFotoRaw).trim();
    const oldFoto = String(beforeUpdatePlain.foto ?? '').trim();

    if (oldFoto !== newFoto) {
      await historyService.createHistory({
        id_karyawan,
        tipe_perubahan: 'foto: diganti',
        value_lama: `foto: ${oldFoto}`,
      });
    }
  }

  // =====================================================
  // UPDATE
  // =====================================================
  const result = await service.updateAdditionalById(id_karyawan, payload);

  return c.json(result, result.success ? 200 : 400);
};

export const updateInformasiPenggajian = async (c: Context) => {
  try {
    const id = c.req.param('id');
    const payload = await c.req.json();

    const result = await service.updateInformasiPenggajian(id, payload);

    if (!result.success) {
      return c.json(result, 400);
    }

    return c.json(result, 200);
  } catch (error) {
    return c.json(
      {
        success: false,
        message: error,
      },
      500
    );
  }
};
