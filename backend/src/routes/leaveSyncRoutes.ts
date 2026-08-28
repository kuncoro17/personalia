import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';

import { getAllLeave, syncLeave } from '../services/leaveSyncService';
import { HttpException } from '../utils/http-exception';

const route = createRoute({
  method: 'post',
  path: '/personalia/leave/sync',
  summary: 'Sinkronisasi cuti dan izin yang telah disetujui',
  tags: ['Leave Sync'],
  request: {
    query: z.object({
      dryRun: z.enum(['true', 'false']).optional().default('false'),
    }),
  },
  responses: {
    200: {
      description: 'Sinkronisasi selesai',
      content: {
        'application/json': {
          schema: z.object({
            success: z.literal(true),
            data: z.object({
              applications: z.number().int(),
              rows: z.number().int(),
              synced: z.number().int(),
              dryRun: z.boolean(),
            }),
          }),
        },
      },
    },
    409: { description: 'Sinkronisasi lain sedang berjalan' },
    500: { description: 'API sumber, validasi, atau database gagal' },
  },
});

const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const leaveRowSchema = z.object({
  nik: z.string(),
  tgl_cuti: dateSchema,
  approval_date: dateSchema.nullable(),
  keperluan: z.string().nullable(),
  tipe: z.string().nullable(),
  tgl_insert: z.string().nullable(),
  flag_pump: z.number().int(),
});

const getRoute = createRoute({
  method: 'get',
  path: '/personalia/leave',
  summary: 'Mengambil data cuti dan izin hasil sinkronisasi',
  tags: ['Leave Sync'],
  responses: {
    200: {
      description: 'Data cuti dan izin berhasil diambil',
      content: {
        'application/json': {
          schema: z.object({
            success: z.literal(true),
            data: z.array(leaveRowSchema),
          }),
        },
      },
    },
    500: { description: 'Database gagal mengambil data' },
  },
});

export const leaveSyncRoutes = (app: OpenAPIHono) => {
  app.openapi(getRoute, async c => {
    const data = await getAllLeave();
    return c.json({ success: true as const, data }, 200);
  });

  app.openapi(route, async c => {
    try {
      const dryRun = c.req.valid('query').dryRun === 'true';
      const data = await syncLeave({ dryRun });
      return c.json({ success: true as const, data }, 200);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === 'Leave sync sedang berjalan'
      ) {
        throw new HttpException(409, error.message);
      }
      throw error;
    }
  });
};
