import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { z } from 'zod';
import { AbsensiController } from '../controllers/AbsensiBagianController';
import { clerkAuthMiddleware } from '../middlewares/clerkAuth';

export const absensiBagianRoutes = (app: OpenAPIHono) => {
  app.use('*', clerkAuthMiddleware);

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
        },
      ],
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
          description: 'Unauthorized',
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
