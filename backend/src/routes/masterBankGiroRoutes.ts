import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { z } from 'zod';
import controller from '../controllers/masterBankGiroController';
import { clerkAuthMiddleware } from '../middlewares/clerkAuth';

export const masterBankGiroRoutes = (app: OpenAPIHono) => {
  const basePath = '/master-bank-giro';
  app.use(`${basePath}/*`, clerkAuthMiddleware);
  app.use(`${basePath}`, clerkAuthMiddleware);

  const router = new OpenAPIHono();

  const MasterBankGiroSchema = z.object({
    id_bank_giro: z.string().uuid(),
    bank_giro: z.string().nullable().optional(),
    id_group_bank: z.string().uuid().nullable().optional(),
  });

  const CreateSchema = z.object({
    bank_giro: z.string().min(1).max(10),
    id_group_bank: z.string().uuid().optional(),
  });

  const UpdateSchema = CreateSchema.partial();

  const ResponseListSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    data: z.array(MasterBankGiroSchema),
  });

  const ResponseSingleSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    data: MasterBankGiroSchema.nullable(),
  });

  router.openapi(
    createRoute({
      method: 'get',
      path: '/',
      summary: 'Get all master bank giro',
      tags: ['Master Bank Giro'],
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
      summary: 'Get master bank giro by ID',
      tags: ['Master Bank Giro'],
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
      summary: 'Create master bank giro',
      tags: ['Master Bank Giro'],
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
      summary: 'Update master bank giro',
      tags: ['Master Bank Giro'],
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
      summary: 'Delete master bank giro',
      tags: ['Master Bank Giro'],
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

export default masterBankGiroRoutes;
