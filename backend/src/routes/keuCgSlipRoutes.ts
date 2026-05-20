import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { z } from 'zod';
import controller from '../controllers/keuCgSlipController';
import { clerkAuthMiddleware } from '../middlewares/clerkAuth';

export const keuCgSlipRoutes = (app: OpenAPIHono) => {
  const basePath = '/keu-cg-slip';
  app.use(`${basePath}/*`, clerkAuthMiddleware);
  app.use(`${basePath}`, clerkAuthMiddleware);

  const KeuCgSlipSchema = z.object({
    id: z.number().int().openapi({ example: 1 }),
    date_time: z.any().nullable().optional(),
    modified: z.any().nullable().optional(),
    ip: z.string().nullable().optional(),
    creator: z.number().int().nullable().optional(),
    modifier: z.number().int().nullable().optional(),
    jenis: z.string().nullable().optional(),
    no_giro: z.string().nullable().optional(),
    bank_giro: z.string().nullable().optional(),
    tgl_giro: z.any().nullable().optional(),
    nama_peminta: z.string().nullable().optional(),
    nom_giro: z.string().nullable().optional(),
    jumlah: z.string().nullable().optional(),
    terbilang: z.string().nullable().optional(),
    no_rek: z.string().nullable().optional(),
    an: z.string().nullable().optional(),
    pd_bank: z.string().nullable().optional(),
    tanggal_today: z.any().nullable().optional(),
  });

  const CreateSchema = KeuCgSlipSchema.omit({ id: true });
  const UpdateSchema = CreateSchema.partial();

  // GET ALL
  app.openapi(
    createRoute({
      method: 'get',
      path: `${basePath}`,
      summary: 'Get all CG Slip',
      tags: ['KEU CG Slip'],
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Berhasil mengambil semua data',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean(),
                message: z.string(),
                data: z.array(KeuCgSlipSchema),
              }),
            },
          },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    controller.getAll
  );

  // GET BY ID
  app.openapi(
    createRoute({
      method: 'get',
      path: `${basePath}/{id}`,
      summary: 'Get CG Slip by ID',
      tags: ['KEU CG Slip'],
      security: [{ bearerAuth: [] }],
      request: {
        params: z.object({ id: z.string().openapi({ example: '1' }) }),
      },
      responses: {
        200: {
          description: 'Berhasil mengambil data',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean(),
                message: z.string(),
                data: KeuCgSlipSchema,
              }),
            },
          },
        },
        404: { description: 'Data tidak ditemukan' },
        401: { description: 'Unauthorized' },
      },
    }),
    controller.getById
  );

  // CREATE
  app.openapi(
    createRoute({
      method: 'post',
      path: `${basePath}`,
      summary: 'Create CG Slip',
      tags: ['KEU CG Slip'],
      security: [{ bearerAuth: [] }],
      request: {
        body: {
          content: {
            'application/json': {
              schema: CreateSchema,
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Berhasil membuat data',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean(),
                message: z.string(),
                data: KeuCgSlipSchema,
              }),
            },
          },
        },
        400: { description: 'Validasi gagal' },
        401: { description: 'Unauthorized' },
      },
    }),
    controller.create
  );

  // UPDATE (PATCH-like via PUT)
  app.openapi(
    createRoute({
      method: 'put',
      path: `${basePath}/{id}`,
      summary: 'Update CG Slip',
      tags: ['KEU CG Slip'],
      security: [{ bearerAuth: [] }],
      request: {
        params: z.object({ id: z.string().openapi({ example: '1' }) }),
        body: {
          content: {
            'application/json': {
              schema: UpdateSchema,
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Berhasil memperbarui data',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean(),
                message: z.string(),
                data: KeuCgSlipSchema,
              }),
            },
          },
        },
        404: { description: 'Data tidak ditemukan' },
        401: { description: 'Unauthorized' },
      },
    }),
    controller.update
  );

  // DELETE
  app.openapi(
    createRoute({
      method: 'delete',
      path: `${basePath}/{id}`,
      summary: 'Delete CG Slip',
      tags: ['KEU CG Slip'],
      security: [{ bearerAuth: [] }],
      request: {
        params: z.object({ id: z.string().openapi({ example: '1' }) }),
      },
      responses: {
        200: {
          description: 'Berhasil menghapus data',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean(),
                message: z.string(),
                data: z.null(),
              }),
            },
          },
        },
        404: { description: 'Data tidak ditemukan' },
        401: { description: 'Unauthorized' },
      },
    }),
    controller.remove
  );
};

export default keuCgSlipRoutes;
