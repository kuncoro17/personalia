import { Context } from 'hono';
import { AbsensiServiceBagian } from '../services/AbsenServicesBagian';
import { ok, badRequest } from '../utils/response.helper';
import { z } from 'zod';

const service = new AbsensiServiceBagian();

const pivotSchema = z.object({
  start: z.string().min(1, 'start wajib diisi'),
  end: z.string().min(1, 'end wajib diisi'),
  unitType: z.string().optional(),
  unitKode: z.string().optional().nullable(),
});

export class AbsensiController {
  static async getPivot(c: Context) {
    try {
      // ✅ validasi query pakai Zod
      const { start, end, unitType, unitKode } = pivotSchema.parse(
        c.req.query()
      );

      const data = await service.getPivot(
        start,
        end,
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
