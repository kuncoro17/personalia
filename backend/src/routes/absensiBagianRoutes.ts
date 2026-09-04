import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { z } from 'zod';
import { AbsensiController } from '../controllers/AbsensiBagianController';
import { apiKeyMiddleware } from '../middlewares/checkApiKey';

export const absensiBagianRoutes = (app: OpenAPIHono) => {
  app.use('/personalia/pivotBagian', apiKeyMiddleware);

  const pivotQuerySchema = z.object({
    tanggal_mulai: z.string().optional().openapi({
      example: '2025-01-16',
      description: 'Tanggal mulai periode (YYYY-MM-DD)',
    }),
    tanggal_selesai: z.string().optional().openapi({
      example: '2025-02-15',
      description: 'Tanggal selesai periode (YYYY-MM-DD)',
    }),
    unitType: z.string().optional().openapi({
      example: 'BAGIAN',
      description: 'Jenis unit (default: BAGIAN)',
    }),
    unitKode: z
      .string()
      .optional()
      .nullable()
      .openapi({ example: null, description: 'Kode unit (alias: unit_kode)' }),
    unit_kode: z
      .string()
      .optional()
      .nullable()
      .openapi({ example: null, description: 'Kode unit (snake_case)' }),
    page: z.coerce.number().int().min(1).optional().openapi({
      example: 1,
      description: 'Halaman hasil',
    }),
    limit: z.coerce.number().int().min(1).max(500).optional().openapi({
      example: 100,
      description: 'Maksimal 500 data per halaman',
    }),
    search: z.string().trim().optional().openapi({
      example: 'BPA',
      description: 'Pencarian pada data hasil pivot',
    }),
  });

  app.openapi(
    createRoute({
      method: 'get',
      path: '/personalia/pivotBagian',
      summary: 'Get pivot data for Bagian',
      description:
        'Mengambil data pivot Bagian untuk server-to-server Core SAS menggunakan x-api-key',
      tags: ['Absensi'],
      security: [
        {
          apiKeyAuth: [],
        },
      ],
      request: {
        query: pivotQuerySchema,
      },
      responses: {
        200: {
          description: 'Berhasil mengambil pivot',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean(),
                message: z.string(),
                data: z.array(
                  z.object({
                    id: z.number().openapi({
                      example: 1,
                    }),
                    namaBagian: z.string().openapi({
                      example: 'HRD',
                    }),
                  })
                ),
              }),
            },
          },
        },
        401: {
          description: 'API key tidak valid',
        },
        400: {
          description: 'Header x-api-key atau parameter periode tidak lengkap',
        },
      },
    }),
    AbsensiController.getPivot
  );
};

// import { OpenAPIHono } from '@hono/zod-openapi';
// import { z } from 'zod';
// import { AbsensiController } from '../controllers/AbsensiBagianController';

// const pivotResponseSchema = z.array(
//   z.object({
//     id: z.number(),
//     namaBagian: z.string(),
//   })
// );

// export const absensiBagianRoutes = (app: OpenAPIHono) => {
//   app.get('/pivotBagian', async (c) => {
//     const data = await AbsensiController.getPivot(c);
//     return c.json({ success: true, message: 'OK', data });
//   }).openapi({
//     summary: 'Get pivot data for Bagian',
//     description: 'Mengambil data pivot Bagian',
//     responses: {
//       200: pivotResponseSchema,
//     },
//   });
// };
