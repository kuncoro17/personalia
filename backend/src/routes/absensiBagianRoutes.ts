import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { z } from 'zod';
import { AbsensiController } from '../controllers/AbsensiBagianController';
import { clerkAuthMiddleware } from '../middlewares/clerkAuth';
import { apiKeyMiddleware } from '../middlewares/checkApiKey';

export const absensiBagianRoutes = (app: OpenAPIHono) => {
  app.use('/personalia/pivotBagian', clerkAuthMiddleware, apiKeyMiddleware);

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
  });

  app.openapi(
    createRoute({
      method: 'get',
      path: '/personalia/pivotBagian',
      summary: 'Get pivot data for Bagian',
      description: 'Mengambil data pivot Bagian',
      tags: ['Absensi'],
      security: [
        {
          bearerAuth: [],
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
          description: 'Bearer token atau API key tidak valid',
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
