// src/routes/presensiRoutes.ts
import { z } from 'zod';
import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { getPresensi } from '../controllers/controllerphp';

export const presensiRoutes = (app: OpenAPIHono) => {
  // Schema untuk satu record presensi
  const PresensiRecordSchema = z.object({
    tanggal: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    nik: z.string(),
    employeename: z.string(),
    jamMasuk: z.string().regex(/^\d{2}:\d{2}:\d{2}$/),
    jamPulang: z.string().regex(/^\d{2}:\d{2}:\d{2}$/),
  });

  // Schema response PHP
  const PresensiResponseSchema = z.object({
    success: z.boolean(),
    data: z.array(PresensiRecordSchema),
  });

  // Route GET /presensi/latest
  app.openapi(
    createRoute({
      method: 'get',
      path: '/presensi/latest',
      summary: 'Get Latest Presensi',
      description:
        'Memanggil PHP API untuk mengambil data presensi berdasarkan userid',
      tags: ['Presensi'],
      request: {
        query: z.object({
          userid: z.string().min(1, 'userid wajib diisi'), // userid wajib
        }),
      },
      responses: {
        200: {
          description: 'Berhasil mengambil presensi',
          content: {
            'application/json': {
              schema: PresensiResponseSchema,
            },
          },
        },
        400: { description: 'Bad request, userid wajib diisi' },
        502: { description: 'Upstream PHP mengembalikan response tidak valid' },
        504: { description: 'Upstream PHP timeout atau tidak dapat dihubungi' },
        500: { description: 'Server error' },
      },
    }),
    getPresensi
  );
};

export default presensiRoutes;
