// import { Hono } from 'hono';
// import {
//   getAll,
//   getById,
//   create,
//   update,
//   remove,
// } from '../controllers/PrsMasterDirekturController';

// import { clerkAuthMiddleware } from '../middlewares/clerkAuth';
// const app = new Hono();
// app.use('*', clerkAuthMiddleware);

// const router = new Hono();

// router.get('/', clerkAuthMiddleware, getAll);
// router.get('/:id', clerkAuthMiddleware, getById);

// router.post('/', clerkAuthMiddleware, create);
// router.put('/:id', clerkAuthMiddleware, update);
// router.delete('/:id', clerkAuthMiddleware, remove);

// export default router;

import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { z } from 'zod';
import {
  getAll,
  getById,
  create,
  update,
  remove,
} from '../controllers/PrsMasterDirekturController';
import { clerkAuthMiddleware } from '../middlewares/clerkAuth';

export const PrsMasterDirekturRoute = (app: OpenAPIHono) => {
  app.use('*', clerkAuthMiddleware);
  const router = new OpenAPIHono();

  // ============================
  // 🔹 Zod Schema
  // ============================
  const DirekturSchema = z.object({
    id: z.string().uuid(),
    nama_dir: z.string(),
    created_at: z.date().optional().nullable(),
    updated_at: z.date().optional().nullable(),
  });

  const CreateSchema = DirekturSchema.omit({ id: true });
  const UpdateSchema = CreateSchema.partial();

  const ResponseSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    data: z.any().nullable(),
  });

  // ============================
  // 🔹 GET ALL
  // ============================
  router.openapi(
    createRoute({
      method: 'get',
      path: '/',
      summary: 'Get all direktur',
      tags: ['Master Direktur'],
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Berhasil mengambil semua direktur',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean().default(true),
                message: z.string().default('Berhasil mengambil data direktur'),
                data: z.array(DirekturSchema),
              }),
            },
          },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    getAll
  );

  // ============================
  // 🔹 GET BY ID
  // ============================
  router.openapi(
    createRoute({
      method: 'get',
      path: '/{id}',
      summary: 'Get direktur by ID',
      tags: ['Master Direktur'],
      security: [{ bearerAuth: [] }],
      request: {
        params: z.object({ id: z.string().uuid() }),
      },
      responses: {
        200: {
          description: 'Berhasil mengambil direktur',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean().default(true),
                message: z.string().default('Berhasil mengambil data direktur'),
                data: DirekturSchema,
              }),
            },
          },
        },
        404: {
          description: 'Direktur tidak ditemukan',
          content: { 'application/json': { schema: ResponseSchema } },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    getById
  );

  // ============================
  // 🔹 CREATE
  // ============================
  router.openapi(
    createRoute({
      method: 'post',
      path: '/',
      summary: 'Create new direktur',
      tags: ['Master Direktur'],
      security: [{ bearerAuth: [] }],
      request: {
        body: { content: { 'application/json': { schema: CreateSchema } } },
      },
      responses: {
        201: {
          description: 'Direktur berhasil dibuat',
          content: { 'application/json': { schema: ResponseSchema } },
        },
        400: {
          description: 'Validasi gagal',
          content: { 'application/json': { schema: ResponseSchema } },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    create
  );

  // ============================
  // 🔹 UPDATE
  // ============================
  router.openapi(
    createRoute({
      method: 'put',
      path: '/{id}',
      summary: 'Update direktur',
      tags: ['Master Direktur'],
      security: [{ bearerAuth: [] }],
      request: {
        params: z.object({ id: z.string().uuid() }),
        body: { content: { 'application/json': { schema: UpdateSchema } } },
      },
      responses: {
        200: {
          description: 'Direktur berhasil diperbarui',
          content: { 'application/json': { schema: ResponseSchema } },
        },
        404: {
          description: 'Direktur tidak ditemukan',
          content: { 'application/json': { schema: ResponseSchema } },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    update
  );

  // ============================
  // 🔹 DELETE
  // ============================
  router.openapi(
    createRoute({
      method: 'delete',
      path: '/{id}',
      summary: 'Delete direktur',
      tags: ['Master Direktur'],
      security: [{ bearerAuth: [] }],
      request: { params: z.object({ id: z.string().uuid() }) },
      responses: {
        200: {
          description: 'Direktur berhasil dihapus',
          content: { 'application/json': { schema: ResponseSchema } },
        },
        404: {
          description: 'Direktur tidak ditemukan',
          content: { 'application/json': { schema: ResponseSchema } },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    remove
  );

  // REGISTER PREFIX
  app.route('/master-direktur', router);
};

export default PrsMasterDirekturRoute;
