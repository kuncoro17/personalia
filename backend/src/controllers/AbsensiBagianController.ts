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

const pivotSchema = z
  .object({
    start: dateOnlySchema,
    end: dateOnlySchema,
    unitType: z.string().optional(),
    unit_type: z.string().optional(),
    unitKode: z.string().optional().nullable(),
    unit_kode: z.string().optional().nullable(),
  })
  .transform(value => ({
    start: value.start,
    end: value.end,
    unitType: value.unitType ?? value.unit_type,
    unitKode: value.unitKode ?? value.unit_kode ?? null,
  }));

export class AbsensiController {
  static async getPivot(c: Context) {
    try {
      // ✅ validasi query pakai Zod
      const { start, end, unitType, unitKode } = pivotSchema.parse(
        c.req.query()
      );

      const now = new Date();
      const defaultEnd = toDateOnlyLocal(now);
      const defaultStart = toDateOnlyLocal(
        new Date(now.getFullYear(), now.getMonth(), 1)
      );

      const data = await service.getPivot(
        start ?? defaultStart,
        end ?? defaultEnd,
        unitType ?? 'BAGIAN',
        unitKode ?? null
      );

      return ok(c, data);
    } catch (err) {
      if (err instanceof Error) {
        return badRequest(c, err.message);
      }
      return badRequest(c, 'Unexpected error');
    }
  }
}
