import { Context } from 'hono';
import { AbsensiServiceBagian } from '../services/AbsenServicesBagian';
import { ok, badRequest } from '../utils/response.helper';
import { z } from 'zod';

const service = new AbsensiServiceBagian();

const toDateOnlyLocal = (d: Date) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const normalizeDateOnly = (value: unknown): string | undefined => {
  if (value === undefined || value === null) return undefined;
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  const dateOnly = trimmed.length >= 10 ? trimmed.slice(0, 10) : trimmed;
  return /^\d{4}-\d{2}-\d{2}$/.test(dateOnly) ? dateOnly : undefined;
};

const dateOnlySchema = z
  .preprocess(normalizeDateOnly, z.string().regex(/^\d{4}-\d{2}-\d{2}$/))
  .optional();

const optionalPositiveInt = z.coerce.number().int().min(1).optional();

const pivotSchema = z
  .object({
    tanggal_mulai: dateOnlySchema,
    tanggal_selesai: dateOnlySchema,
    unitType: z.string().optional(),
    unit_type: z.string().optional(),
    unitKode: z.string().optional().nullable(),
    unit_kode: z.string().optional().nullable(),
    page: optionalPositiveInt,
    limit: z.coerce.number().int().min(1).max(500).optional(),
    search: z.string().trim().optional(),
  })
  .transform(value => ({
    start: value.tanggal_mulai,
    end: value.tanggal_selesai,
    unitType: value.unitType ?? value.unit_type,
    unitKode: value.unitKode ?? value.unit_kode ?? null,
    page: value.page,
    limit: value.limit,
    search: value.search,
  }));

const toPlainRow = (row: unknown) => {
  if (row && typeof row === 'object' && 'toJSON' in row) {
    const maybeModel = row as { toJSON?: () => unknown };
    if (typeof maybeModel.toJSON === 'function') {
      return maybeModel.toJSON();
    }
  }

  return row;
};

const matchesSearch = (row: unknown, search: string) => {
  if (!row || typeof row !== 'object') return false;

  const targetFields = [
    'nik',
    'nama_lengkap',
    'unit_kerja',
    'nama_div',
    'nama_bag',
  ];
  const normalizedSearch = search.toLowerCase();
  const record = row as Record<string, unknown>;

  return targetFields.some(field =>
    String(record[field] ?? '')
      .toLowerCase()
      .includes(normalizedSearch)
  );
};

export class AbsensiController {
  static async getPivot(c: Context) {
    try {
      // ✅ validasi query pakai Zod
      const { start, end, unitType, unitKode, page, limit, search } =
        pivotSchema.parse(c.req.query());
      const shouldPaginate =
        c.req.query('page') !== undefined || c.req.query('limit') !== undefined;
      const currentPage = page ?? 1;
      const perPage = limit ?? 10;

      const now = new Date();
      const defaultEnd = toDateOnlyLocal(now);
      const defaultStart = toDateOnlyLocal(
        new Date(now.getFullYear(), now.getMonth(), 1)
      );

      const rows = await service.getPivot(
        start ?? defaultStart,
        end ?? defaultEnd,
        unitType ?? 'BAGIAN',
        unitKode ?? null
      );

      const plainRows = rows.map(toPlainRow);
      const filteredRows = search
        ? plainRows.filter(row => matchesSearch(row, search))
        : plainRows;

      if (!shouldPaginate) {
        return ok(c, filteredRows);
      }

      const total = filteredRows.length;
      const totalPages = Math.max(Math.ceil(total / perPage), 1);
      const offset = (currentPage - 1) * perPage;

      return c.json(
        {
          success: true,
          message: 'OK',
          data: filteredRows.slice(offset, offset + perPage),
          pagination: {
            page: currentPage,
            limit: perPage,
            total,
            totalPages,
          },
        },
        200
      );
    } catch (err) {
      if (err instanceof Error) {
        return badRequest(c, err.message);
      }
      return badRequest(c, 'Unexpected error');
    }
  }
}
