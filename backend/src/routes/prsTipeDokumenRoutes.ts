import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { z } from 'zod';
import * as controller from '../controllers/prsTipeDokumenController';
import { clerkAuthMiddleware } from '../middlewares/clerkAuth';

const TipeDokumenSchema = z.object({
  id: z.string().uuid(),
  tipe_dokumen: z.string().max(100),
  created_at: z.string().datetime().nullable().optional(),
  updated_at: z.string().datetime().nullable().optional(),
  deleted_at: z.string().datetime().nullable().optional(),
});

const SaveTipeDokumenSchema = z.object({
  tipe_dokumen: z.string().trim().min(1).max(100),
});

const ListResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.array(TipeDokumenSchema),
});

const SingleResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: TipeDokumenSchema,
});

const DeleteResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.boolean(),
});

const IdParamsSchema = z.object({ id: z.string().uuid() });

export const prsTipeDokumenRoutes = (app: OpenAPIHono) => {
  const basePath = '/tipe-dokumen';
  const router = new OpenAPIHono();

  app.use(basePath, clerkAuthMiddleware);
  app.use(`${basePath}/*`, clerkAuthMiddleware);

  router.openapi(
    createRoute({
      method: 'get',
      path: '/',
      summary: 'Get all tipe dokumen',
      tags: ['Tipe Dokumen'],
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Berhasil mengambil semua tipe dokumen',
          content: { 'application/json': { schema: ListResponseSchema } },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    controller.getAll
  );

  router.openapi(
    createRoute({
      method: 'get',
      path: '/{id}',
      summary: 'Get tipe dokumen by ID',
      tags: ['Tipe Dokumen'],
      security: [{ bearerAuth: [] }],
      request: { params: IdParamsSchema },
      responses: {
        200: {
          description: 'Berhasil mengambil tipe dokumen',
          content: { 'application/json': { schema: SingleResponseSchema } },
        },
        404: { description: 'Tipe dokumen tidak ditemukan' },
        401: { description: 'Unauthorized' },
      },
    }),
    controller.getTipeDokumen
  );

  router.openapi(
    createRoute({
      method: 'post',
      path: '/',
      summary: 'Create tipe dokumen',
      tags: ['Tipe Dokumen'],
      security: [{ bearerAuth: [] }],
      request: {
        body: {
          content: { 'application/json': { schema: SaveTipeDokumenSchema } },
        },
      },
      responses: {
        201: {
          description: 'Tipe dokumen berhasil dibuat',
          content: { 'application/json': { schema: SingleResponseSchema } },
        },
        400: { description: 'Validasi gagal' },
        401: { description: 'Unauthorized' },
      },
    }),
    controller.createTipeDokumen
  );

  router.openapi(
    createRoute({
      method: 'put',
      path: '/{id}',
      summary: 'Update tipe dokumen',
      tags: ['Tipe Dokumen'],
      security: [{ bearerAuth: [] }],
      request: {
        params: IdParamsSchema,
        body: {
          content: { 'application/json': { schema: SaveTipeDokumenSchema } },
        },
      },
      responses: {
        200: {
          description: 'Tipe dokumen berhasil diperbarui',
          content: { 'application/json': { schema: SingleResponseSchema } },
        },
        400: { description: 'Validasi gagal' },
        404: { description: 'Tipe dokumen tidak ditemukan' },
        401: { description: 'Unauthorized' },
      },
    }),
    controller.updateTipeDokumen
  );

  router.openapi(
    createRoute({
      method: 'delete',
      path: '/{id}',
      summary: 'Delete tipe dokumen',
      tags: ['Tipe Dokumen'],
      security: [{ bearerAuth: [] }],
      request: { params: IdParamsSchema },
      responses: {
        200: {
          description: 'Tipe dokumen berhasil dihapus',
          content: { 'application/json': { schema: DeleteResponseSchema } },
        },
        404: { description: 'Tipe dokumen tidak ditemukan' },
        401: { description: 'Unauthorized' },
      },
    }),
    controller.deleteTipeDokumen
  );

  app.route(basePath, router);
};

export default prsTipeDokumenRoutes;
