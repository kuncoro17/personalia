import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { z } from 'zod';
import controller from '../controllers/masterGroupBankController';
import { clerkAuthMiddleware } from '../middlewares/clerkAuth';

export const masterGroupBankRoutes = (app: OpenAPIHono) => {
  const basePath = '/master-group-bank';
  app.use(`${basePath}/*`, clerkAuthMiddleware);
  app.use(`${basePath}`, clerkAuthMiddleware);

  const router = new OpenAPIHono();

  const MasterGroupBankSchema = z.object({
    id: z.string().uuid(),
    group_bank: z.string().nullable().optional(),
  });

  const CreateSchema = z.object({
    group_bank: z.string().min(1).max(10),
  });

  const UpdateSchema = CreateSchema.partial();

  const ResponseListSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    data: z.array(MasterGroupBankSchema),
  });

  const ResponseSingleSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    data: MasterGroupBankSchema.nullable(),
  });

  router.openapi(
    createRoute({
      method: 'get',
      path: '/',
      summary: 'Get all master group bank',
      tags: ['Master Group Bank'],
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Berhasil mengambil semua data',
          content: { 'application/json': { schema: ResponseListSchema } },
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
      summary: 'Get master group bank by ID',
      tags: ['Master Group Bank'],
      security: [{ bearerAuth: [] }],
      request: {
        params: z.object({ id: z.string().uuid() }),
      },
      responses: {
        200: {
          description: 'Berhasil mengambil data',
          content: { 'application/json': { schema: ResponseSingleSchema } },
        },
        404: { description: 'Data tidak ditemukan' },
        401: { description: 'Unauthorized' },
      },
    }),
    controller.getById
  );

  router.openapi(
    createRoute({
      method: 'post',
      path: '/',
      summary: 'Create master group bank',
      tags: ['Master Group Bank'],
      security: [{ bearerAuth: [] }],
      request: {
        body: { content: { 'application/json': { schema: CreateSchema } } },
      },
      responses: {
        201: {
          description: 'Berhasil membuat data',
          content: { 'application/json': { schema: ResponseSingleSchema } },
        },
        400: { description: 'Validasi gagal' },
        401: { description: 'Unauthorized' },
      },
    }),
    controller.create
  );

  router.openapi(
    createRoute({
      method: 'put',
      path: '/{id}',
      summary: 'Update master group bank',
      tags: ['Master Group Bank'],
      security: [{ bearerAuth: [] }],
      request: {
        params: z.object({ id: z.string().uuid() }),
        body: { content: { 'application/json': { schema: UpdateSchema } } },
      },
      responses: {
        200: {
          description: 'Berhasil memperbarui data',
          content: { 'application/json': { schema: ResponseSingleSchema } },
        },
        404: { description: 'Data tidak ditemukan' },
        401: { description: 'Unauthorized' },
      },
    }),
    controller.update
  );

  router.openapi(
    createRoute({
      method: 'delete',
      path: '/{id}',
      summary: 'Delete master group bank',
      tags: ['Master Group Bank'],
      security: [{ bearerAuth: [] }],
      request: {
        params: z.object({ id: z.string().uuid() }),
      },
      responses: {
        200: {
          description: 'Berhasil menghapus data',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean(),
                message: z.string(),
                data: z.boolean(),
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

  app.route(basePath, router);
};

export default masterGroupBankRoutes;
