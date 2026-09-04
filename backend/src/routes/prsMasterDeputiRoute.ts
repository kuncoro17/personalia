// import { Hono } from 'hono';
// import {
//   getAll,
//   getById,
//   getByKode,
//   create,
//   update,
//   remove,
// } from '../controllers/prsMasterDeputiController';

// import { clerkAuthMiddleware } from '../middlewares/clerkAuth';
// const app = new Hono();
// app.use('*', clerkAuthMiddleware);

// const router = new Hono();

// router.get('/', clerkAuthMiddleware, getAll);
// router.get('/:id', clerkAuthMiddleware, getById);
// router.get('/kode/:kode', clerkAuthMiddleware, getByKode); // 🆕 route baru
// router.post('/', clerkAuthMiddleware, create);
// router.put('/:id', clerkAuthMiddleware, update);
// router.delete('/:id', clerkAuthMiddleware, remove);

// export default router;

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
} from '../controllers/prsMasterDeputiController';
import { clerkAuthMiddleware } from '../middlewares/clerkAuth';

export const PrsMasterDeputiRoute = (app: OpenAPIHono) => {
  app.use('*', clerkAuthMiddleware);
  const router = new OpenAPIHono();

  // ============================
  // 🔹 Zod Schema
  // ============================
  const DeputiSchema = z.object({
    id: z.string().uuid(),
    kode: z.string(),
    nama_dep: z.string(),
  });

  const CreateSchema = DeputiSchema.omit({ id: true });
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
      path: '/getAllDeputi',
      summary: 'Get all deputi',
      tags: ['Master Deputi'],
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Berhasil mengambil semua deputi',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean().default(true),
                message: z.string().default('Berhasil mengambil data deputi'),
                data: z.array(DeputiSchema),
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
      path: '/getDeputiById/{id}',
      summary: 'Get deputi by ID',
      tags: ['Master Deputi'],
      security: [{ bearerAuth: [] }],
      request: {
        params: z.object({ id: z.string().uuid() }),
      },
      responses: {
        200: {
          description: 'Berhasil mengambil deputi',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean().default(true),
                message: z.string().default('Berhasil mengambil data deputi'),
                data: DeputiSchema,
              }),
            },
          },
        },
        404: {
          description: 'Deputi tidak ditemukan',
          content: {
            'application/json': {
              schema: ResponseSchema,
            },
          },
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
      path: '/create-deputi',
      summary: 'Create new deputi',
      tags: ['Master Deputi'],
      security: [{ bearerAuth: [] }],
      request: {
        body: { content: { 'application/json': { schema: CreateSchema } } },
      },
      responses: {
        201: {
          description: 'Deputi berhasil dibuat',
          content: {
            'application/json': {
              schema: ResponseSchema,
            },
          },
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
      path: '/update-deputi/{id}',
      summary: 'Update deputi',
      tags: ['Master Deputi'],
      security: [{ bearerAuth: [] }],
      request: {
        params: z.object({ id: z.string().uuid() }),
        body: { content: { 'application/json': { schema: UpdateSchema } } },
      },
      responses: {
        200: {
          description: 'Deputi berhasil diperbarui',
          content: {
            'application/json': {
              schema: ResponseSchema,
            },
          },
        },
        404: {
          description: 'Deputi tidak ditemukan',
          content: {
            'application/json': {
              schema: ResponseSchema,
            },
          },
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
      path: '/delete-deputi/{id}',
      summary: 'Delete deputi',
      tags: ['Master Deputi'],
      security: [{ bearerAuth: [] }],
      request: { params: z.object({ id: z.string().uuid() }) },
      responses: {
        200: {
          description: 'Deputi berhasil dihapus',
          content: { 'application/json': { schema: ResponseSchema } },
        },
        404: {
          description: 'Deputi tidak ditemukan',
          content: { 'application/json': { schema: ResponseSchema } },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    remove
  );

  // REGISTER PREFIX
  app.route('/master-deputi', router);
};

export default PrsMasterDeputiRoute;
