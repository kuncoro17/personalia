// import { Hono } from 'hono';
// import controller from '../controllers/prsMasterAgamaController';

// import { clerkAuthMiddleware } from '../middlewares/clerkAuth';
// const app = new Hono();
// app.use('*', clerkAuthMiddleware);

// const router = new Hono();

// router.get('/', clerkAuthMiddleware, controller.getAll);
// router.get('/by-id/:kode_agama', clerkAuthMiddleware, controller.getById);
// router.post('/created', clerkAuthMiddleware, controller.create);
// router.put('/update/:id', clerkAuthMiddleware, controller.update);
// router.delete('/delete/:id', clerkAuthMiddleware, controller.remove);

// export default router;

import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { z } from 'zod';
import controller from '../controllers/prsMasterAgamaController';
import { clerkAuthMiddleware } from '../middlewares/clerkAuth';

export const prsMasterAgamaRoutes = (app: OpenAPIHono) => {
  app.use('*', clerkAuthMiddleware);
  const basePath = '/master-agama';

  const AgamaSchema = z.object({
    kode_agama: z.number().int().openapi({ example: 1 }),
    agama: z.string().openapi({ example: 'Islam' }),
    created_at: z
      .string()
      .datetime()
      .optional()
      .openapi({ example: '2026-05-18T00:00:00.000Z' }),
    updated_at: z
      .string()
      .datetime()
      .nullable()
      .optional()
      .openapi({ example: '2026-05-18T00:00:00.000Z' }),
  });

  const CreateAgamaSchema = z.object({
    agama: z.string().min(1).openapi({ example: 'Islam' }),
  });

  const UpdateAgamaSchema = z.object({
    agama: z.string().min(1).openapi({ example: 'Kristen' }),
  });

  const AgamaArraySchema = z.array(AgamaSchema);

  // GET ALL
  app.openapi(
    createRoute({
      method: 'get',
      path: `${basePath}`,
      summary: 'Get all Agama',
      tags: ['Master Agama'],
      responses: {
        200: {
          description: 'Berhasil mengambil semua agama',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean(),
                message: z.string().default('Berhasil mengambil data'),
                data: AgamaArraySchema,
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
      path: `${basePath}/{kode_agama}`,
      summary: 'Get Agama by Kode Agama',
      tags: ['Master Agama'],
      request: {
        params: z.object({
          kode_agama: z
            .string()
            .regex(/^[0-9]+$/)
            .openapi({ example: '1' }),
        }),
      },
      responses: {
        200: {
          description: 'Berhasil mengambil agama',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean(),
                message: z.string().default('Berhasil mengambil data'),
                data: AgamaSchema,
              }),
            },
          },
        },
        404: {
          description: 'Agama tidak ditemukan',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean(),
                message: z.string().default('Data tidak ditemukan'),
                data: z.null(),
              }),
            },
          },
        },
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
      summary: 'Create new Agama',
      tags: ['Master Agama'],
      request: {
        body: {
          content: { 'application/json': { schema: CreateAgamaSchema } },
        },
      },
      responses: {
        201: {
          description: 'Agama berhasil dibuat',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean(),
                message: z.string().default('Berhasil membuat data'),
                data: AgamaSchema,
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

  // UPDATE
  app.openapi(
    createRoute({
      method: 'put',
      path: `${basePath}/{id}`,
      summary: 'Update Agama',
      tags: ['Master Agama'],
      request: {
        params: z.object({
          id: z
            .string()
            .regex(/^[0-9]+$/)
            .openapi({ example: '1' }),
        }),
        body: {
          content: { 'application/json': { schema: UpdateAgamaSchema } },
        },
      },
      responses: {
        200: {
          description: 'Agama berhasil diperbarui',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean(),
                message: z.string().default('Berhasil memperbarui data'),
                data: AgamaSchema,
              }),
            },
          },
        },
        404: {
          description: 'Agama tidak ditemukan',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean(),
                message: z.string().default('Data tidak ditemukan'),
                data: z.null(),
              }),
            },
          },
        },
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
      summary: 'Delete Agama',
      tags: ['Master Agama'],
      request: {
        params: z.object({ id: z.string().openapi({ example: '1' }) }),
      },
      responses: {
        200: {
          description: 'Agama berhasil dihapus',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean(),
                message: z.string().default('Berhasil menghapus data'),
                data: z.null(),
              }),
            },
          },
        },
        404: {
          description: 'Agama tidak ditemukan',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean(),
                message: z.string().default('Data tidak ditemukan'),
                data: z.null(),
              }),
            },
          },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    controller.remove
  );
};

export default prsMasterAgamaRoutes;
