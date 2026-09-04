import { AbsensiRepository } from '../repositories/AbsensiRepository';
import { BadRequestException } from '../utils/http-exception';

export type AbsensiBagianRepository = Pick<
  AbsensiRepository,
  'getAbsensiPivotBagian'
>;

const isValidDateOnly = (value: string): boolean => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
};

const MAX_PIVOT_RANGE_DAYS = 62;
const DAY_IN_MS = 24 * 60 * 60 * 1000;

const dateOnlyToUtcTimestamp = (value: string): number => {
  const [year, month, day] = value.split('-').map(Number);
  return Date.UTC(year, month - 1, day);
};

export class AbsensiServiceBagian {
  private readonly repo: AbsensiBagianRepository;

  constructor(repo: AbsensiBagianRepository = new AbsensiRepository()) {
    this.repo = repo;
  }

  async getPivot(
    start: string,
    end: string,
    unitType: string,
    unitKode: string | null
  ) {
    if (!start || !end) {
      throw new BadRequestException('Tanggal mulai dan akhir wajib diisi');
    }

    if (!isValidDateOnly(start) || !isValidDateOnly(end)) {
      throw new BadRequestException('Format tanggal harus YYYY-MM-DD');
    }

    if (start > end) {
      throw new BadRequestException(
        'Tanggal mulai tidak boleh melewati tanggal selesai'
      );
    }

    const rangeDays =
      (dateOnlyToUtcTimestamp(end) - dateOnlyToUtcTimestamp(start)) /
        DAY_IN_MS +
      1;
    if (rangeDays > MAX_PIVOT_RANGE_DAYS) {
      throw new BadRequestException(
        `Rentang tanggal maksimal ${MAX_PIVOT_RANGE_DAYS} hari`
      );
    }

    return await this.repo.getAbsensiPivotBagian(
      start,
      end,
      unitType,
      unitKode
    );
  }
}
