import xss from 'xss';
import { z } from 'zod';
import KeuCgSlipRepository from '../repositories/keuCgSlipRepo';
import {
  BadRequestException,
  NotFoundException,
} from '../utils/http-exception';
import type {
  KeuCgSlipAttributes,
  KeuCgSlipCreationAttributes,
} from '../models/KeuCgSlip';
import { terbilangRupiah } from '../utils/terbilang';

const isValidNumericId = (id: number): boolean => Number.isFinite(id) && id > 0;

const nullableString = (max: number) =>
  z.preprocess(
    value => {
      if (value === undefined || value === null) return value;
      if (typeof value === 'number' || typeof value === 'boolean') {
        return String(value);
      }
      if (typeof value !== 'string') return value;

      const trimmed = value.trim();
      if (!trimmed || trimmed.toLowerCase() === 'string') return undefined;
      return trimmed;
    },
    z
      .string()
      .max(max)
      .transform(value => xss(value))
      .nullish()
  );

const nullableInt = () =>
  z.preprocess(value => {
    if (value === undefined || value === null) return value;
    if (typeof value === 'number') return value;
    if (typeof value !== 'string') return value;

    const trimmed = value.trim();
    if (!trimmed || trimmed.toLowerCase() === 'string') return undefined;

    const asNumber = Number(trimmed);
    return Number.isFinite(asNumber) ? asNumber : undefined;
  }, z.number().int().nullish());

const nullableDateOnlyString = () =>
  z.preprocess(value => {
    if (value === undefined || value === null) return value;
    if (typeof value !== 'string') return value;

    const trimmed = value.trim();
    if (!trimmed || trimmed.toLowerCase() === 'string') return undefined;

    return /^\d{4}-\d{2}-\d{2}$/.test(trimmed) ? trimmed : undefined;
  }, z.string().nullish());

const nullableDateTimeString = () =>
  z.preprocess(
    value => {
      if (value === undefined || value === null) return value;
      if (value instanceof Date) return value;
      if (typeof value !== 'string') return value;

      const trimmed = value.trim();
      if (!trimmed || trimmed.toLowerCase() === 'string') return undefined;

      const date = new Date(trimmed);
      return Number.isNaN(date.getTime()) ? undefined : trimmed;
    },
    z.union([z.string(), z.date()]).nullish()
  );

const nullableBigIntString = () =>
  z.preprocess(value => {
    if (value === undefined || value === null) return value;
    if (typeof value === 'bigint') return value.toString();
    if (typeof value === 'number') {
      if (!Number.isFinite(value)) return undefined;
      if (!Number.isInteger(value)) return undefined;
      return String(value);
    }
    if (typeof value !== 'string') return value;

    const trimmed = value.trim();
    if (!trimmed || trimmed.toLowerCase() === 'string') return undefined;
    return /^-?\d+$/.test(trimmed) ? trimmed : undefined;
  }, z.string().max(30).nullish());

export const KeuCgSlipCreateSchema = z.object({
  date_time: nullableDateTimeString(),
  modified: nullableDateTimeString(), // akan dioverride server
  ip: nullableString(25), // akan dioverride server
  creator: nullableInt(),
  modifier: nullableInt(),
  jenis: nullableString(255),
  no_giro: nullableString(255),
  bank_giro: nullableString(255),
  tgl_giro: nullableDateOnlyString(),
  nama_peminta: nullableString(255),
  nom_giro: nullableString(50),
  jumlah: nullableBigIntString(),
  terbilang: nullableString(255), // akan dioverride server
  no_rek: z.preprocess(
    value => {
      if (value === undefined || value === null) return value;
      if (typeof value === 'number' || typeof value === 'boolean') {
        return String(value);
      }
      if (typeof value !== 'string') return value;

      const trimmed = value.trim();
      if (!trimmed || trimmed.toLowerCase() === 'string') return undefined;
      return trimmed;
    },
    z
      .string()
      .transform(v => xss(v))
      .nullish()
  ),
  an: nullableString(255),
  pd_bank: nullableString(255), // default dari no_giro jika tidak dikirim
  tanggal_today: nullableDateTimeString(), // akan dioverride server
});

export type KeuCgSlipCreateDTO = z.infer<typeof KeuCgSlipCreateSchema>;

export const KeuCgSlipUpdateSchema = KeuCgSlipCreateSchema.partial();
export type KeuCgSlipUpdateDTO = z.infer<typeof KeuCgSlipUpdateSchema>;

const toCreationPayload = (
  dto: KeuCgSlipCreateDTO
): KeuCgSlipCreationAttributes => {
  const now = new Date();
  const todayDateOnly = now.toISOString().slice(0, 10);
  const tglGiro = dto.tgl_giro ?? todayDateOnly;
  const jumlahValue = dto.jumlah ?? null;
  const jumlahAsBigInt =
    typeof jumlahValue === 'string' && /^-?\d+$/.test(jumlahValue)
      ? BigInt(jumlahValue)
      : undefined;
  return {
    ...dto,
    date_time:
      dto.date_time instanceof Date
        ? dto.date_time
        : dto.date_time
          ? new Date(dto.date_time)
          : now,
    modified: now,
    tanggal_today:
      dto.tanggal_today instanceof Date
        ? dto.tanggal_today
        : dto.tanggal_today
          ? new Date(dto.tanggal_today)
          : now,
    tgl_giro: tglGiro,
    creator:
      typeof dto.creator === 'number' && !Number.isNaN(dto.creator)
        ? dto.creator
        : 1,
    modifier:
      typeof dto.modifier === 'number' && !Number.isNaN(dto.modifier)
        ? dto.modifier
        : 1,
    jenis:
      typeof dto.jenis === 'string' && dto.jenis.trim()
        ? dto.jenis.trim().startsWith('VA/')
          ? dto.jenis.trim()
          : `VA/${tglGiro} ${dto.jenis.trim()}`
        : dto.jenis ?? null,
    pd_bank: dto.pd_bank ?? dto.no_giro ?? null,
    terbilang:
      jumlahAsBigInt == null ? dto.terbilang ?? null : terbilangRupiah(jumlahAsBigInt),
  } as KeuCgSlipCreationAttributes;
};

const toUpdatePayload = (
  dto: KeuCgSlipUpdateDTO
): Partial<KeuCgSlipAttributes> => {
  const now = new Date();
  const todayDateOnly = now.toISOString().slice(0, 10);
  const tglGiro = 'tgl_giro' in dto ? (dto.tgl_giro ?? todayDateOnly) : undefined;
  const jumlahValue = dto.jumlah ?? null;
  const jumlahAsBigInt =
    typeof jumlahValue === 'string' && /^-?\d+$/.test(jumlahValue)
      ? BigInt(jumlahValue)
      : undefined;
  const toDateOrUndefined = (value: unknown): Date | undefined => {
    if (value instanceof Date) return value;
    if (typeof value !== 'string') return undefined;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? undefined : date;
  };

  return {
    ...dto,
    date_time:
      'date_time' in dto ? toDateOrUndefined(dto.date_time) : undefined,
    modified: now,
    tanggal_today:
      'tanggal_today' in dto ? toDateOrUndefined(dto.tanggal_today) : now,
    tgl_giro: tglGiro,
    modifier: 'modifier' in dto ? (dto.modifier ?? 1) : 1,
    jenis:
      'jenis' in dto
        ? typeof dto.jenis === 'string' && dto.jenis.trim()
          ? dto.jenis.trim().startsWith('VA/')
            ? dto.jenis.trim()
            : `VA/${(typeof tglGiro === 'string' ? tglGiro : todayDateOnly)} ${dto.jenis.trim()}`
          : dto.jenis ?? null
        : undefined,
    pd_bank: 'pd_bank' in dto ? (dto.pd_bank ?? dto.no_giro ?? null) : undefined,
    terbilang:
      jumlahAsBigInt == null
        ? undefined
        : terbilangRupiah(jumlahAsBigInt),
  } as Partial<KeuCgSlipAttributes>;
};

export default {
  async getAll() {
    return await KeuCgSlipRepository.findAll();
  },

  async getById(id: number) {
    if (!isValidNumericId(id)) throw new BadRequestException('ID tidak valid');
    const data = await KeuCgSlipRepository.findById(id);
    if (!data) throw new NotFoundException('Data tidak ditemukan');
    return data;
  },

  async create(data: unknown) {
    const parsed = KeuCgSlipCreateSchema.safeParse(data);
    if (!parsed.success) {
      throw new BadRequestException(
        parsed.error.issues.map(issue => issue.message).join(', ')
      );
    }

    return await KeuCgSlipRepository.create(toCreationPayload(parsed.data));
  },

  async update(id: number, data: unknown) {
    if (!isValidNumericId(id)) throw new BadRequestException('ID tidak valid');

    const parsed = KeuCgSlipUpdateSchema.safeParse(data);
    if (!parsed.success) {
      throw new BadRequestException(
        parsed.error.issues.map(issue => issue.message).join(', ')
      );
    }

    const updated = await KeuCgSlipRepository.update(
      id,
      toUpdatePayload(parsed.data)
    );
    if (!updated) throw new NotFoundException('Data tidak ditemukan');
    return updated;
  },

  async delete(id: number) {
    if (!isValidNumericId(id)) throw new BadRequestException('ID tidak valid');
    const deleted = await KeuCgSlipRepository.delete(id);
    if (!deleted) throw new NotFoundException('Data tidak ditemukan');
    return true;
  },
};
