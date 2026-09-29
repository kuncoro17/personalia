import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';

import { getAllLeave, syncLeave } from '../services/leaveSyncService';
import {
  clerkAuthMiddleware,
  requireAllowedEmails,
} from '../middlewares/clerkAuth';
import { HttpException } from '../utils/http-exception';

const LEAVE_SYNC_ALLOWED_EMAILS = [
  'kuncoro.kinasih@bpkpenaburjakarta.or.id',
  'antoni.wijaya@bpkpenaburjakarta.or.id',
] as const;

const sourceLeaveRecordSchema = z.object({
  id: z.string(),
  nik: z.string(),
  tanggal: z.string(),
  nama_lengkap: z.string().optional(),
  email: z.string().optional(),
  tanggal_mulai: z.string(),
  tanggal_selesai: z.string(),
  jumlah_hari: z.number(),
  tipe_cuti: z.string(),
  jenis_cuti: z.string().optional(),
  alasan_cuti: z.string().nullable(),
  status: z.string().optional(),
  status_persetujuan: z.number(),
  tanggal_persetujuan: z.string().nullable().optional(),
});

const route = createRoute({
  method: 'post',
  path: '/personalia/leave/sync',
  summary: 'Sinkronisasi cuti dan izin yang telah disetujui',
  tags: ['Leave Sync'],
  security: [{ bearerAuth: [] }],
  request: {
    query: z.object({
      dryRun: z.enum(['true', 'false']).optional().default('false'),
      startDate: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/)
        .optional(),
      endDate: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/)
        .optional(),
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
              startDate: z.string(),
              endDate: z.string(),
              sourceData: z.array(sourceLeaveRecordSchema),
            }),
          }),
        },
      },
    },
    401: { description: 'Token autentikasi tidak valid atau tidak diberikan' },
    403: { description: 'Email tidak diizinkan menjalankan sinkronisasi' },
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
  app.use('/personalia/leave/sync', clerkAuthMiddleware);
  app.use(
    '/personalia/leave/sync',
    requireAllowedEmails(LEAVE_SYNC_ALLOWED_EMAILS)
  );

  app.openapi(getRoute, async c => {
    const data = await getAllLeave();
    return c.json({ success: true as const, data }, 200);
  });

  app.openapi(route, async c => {
    try {
      const dryRun = c.req.valid('query').dryRun === 'true';
      const data = await syncLeave({
        dryRun,
        startDate: c.req.valid('query').startDate,
        endDate: c.req.valid('query').endDate,
      });
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
