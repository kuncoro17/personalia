import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';

import { apiKeyMiddleware } from '../middlewares/checkApiKey';
import { syncAttendance } from '../services/attendanceSyncService';
import { HttpException } from '../utils/http-exception';

const syncQuerySchema = z.object({
  dryRun: z.enum(['true', 'false']).optional().default('false').openapi({
    example: 'true',
    description:
      'Jika true, hanya menguji koneksi dan mapping tanpa mengubah database',
  }),
  batchSize: z.coerce
    .number()
    .int()
    .min(1)
    .max(1000)
    .optional()
    .default(500)
    .openapi({
      example: 500,
      description: 'Jumlah record yang diproses per batch',
    }),
  maxBatches: z.coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .optional()
    .default(10)
    .openapi({
      example: 10,
      description:
        'Batas batch per request agar request HTTP tidak berjalan terlalu lama',
    }),
  fromDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .default('2026-06-01')
    .openapi({
      example: '2026-06-01',
      description:
        'Hanya menarik record dengan stime mulai tanggal ini (YYYY-MM-DD)',
    }),
});

const syncResultSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  data: z.object({
    batches: z.number().int(),
    processed: z.number().int(),
    inserted: z.number().int(),
    alreadyExisted: z.number().int(),
    dryRun: z.boolean(),
    fromDate: z.string(),
  }),
});

export const attendanceSyncRoutes = (app: OpenAPIHono) => {
  app.use('/personalia/attendance/sync', apiKeyMiddleware);

  app.openapi(
    createRoute({
      method: 'post',
      path: '/personalia/attendance/sync',
      summary: 'Sinkronisasi data attendance dari MySQL',
      description:
        'Menarik record dengan sudah_sync=0 dari MySQL attendance dan ' +
        'memasukkannya ke PostgreSQL public.sdm_checkinout. ' +
        'Sumber baru ditandai sudah_sync=1 setelah transaksi PostgreSQL berhasil.',
      tags: ['Attendance Sync'],
      security: [{ apiKeyAuth: [] }],
      request: {
        query: syncQuerySchema,
      },
      responses: {
        200: {
          description: 'Sinkronisasi selesai',
          content: {
            'application/json': {
              schema: syncResultSchema,
            },
          },
        },
        400: {
          description: 'Parameter tidak valid atau API key tidak diberikan',
        },
        401: {
          description: 'API key tidak valid',
        },
        409: {
          description: 'Proses sinkronisasi lain sedang berjalan',
        },
        500: {
          description: 'Koneksi atau proses sinkronisasi gagal',
        },
      },
    }),
    async c => {
      const query = c.req.valid('query');

      try {
        const result = await syncAttendance({
          dryRun: query.dryRun === 'true',
          batchSize: query.batchSize,
          maxBatches: query.maxBatches,
          fromDate: query.fromDate,
        });

        return c.json(
          {
            success: true as const,
            message: query.dryRun
              ? 'Dry-run sinkronisasi berhasil'
              : 'Sinkronisasi attendance berhasil',
            data: result,
          },
          200
        );
      } catch (error) {
        if (
          error instanceof Error &&
          error.message === 'Attendance sync sedang berjalan'
        ) {
          throw new HttpException(409, error.message);
        }
        throw error;
      }
    }
  );
};
