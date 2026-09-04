// import { Hono } from 'hono';
// import controller from '../controllers/prsPengalamanController';

// import { clerkAuthMiddleware } from '../middlewares/clerkAuth';
// const app = new Hono();
// app.use('*', clerkAuthMiddleware);

// const router = new Hono();

// router.get('/', clerkAuthMiddleware, controller.getAll);
// router.get('/by-id/:id', clerkAuthMiddleware, controller.getById);
// router.post('/created', clerkAuthMiddleware, controller.create);
// router.put('/:id', clerkAuthMiddleware, controller.update);
// router.delete('/:id', clerkAuthMiddleware, controller.remove);

// export default router;

import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { z } from 'zod';
import controller from '../controllers/prsPengalamanController';
import { clerkAuthMiddleware } from '../middlewares/clerkAuth';

export const prsPengalamanRoutes = (app: OpenAPIHono) => {
  app.use('*', clerkAuthMiddleware);
  const router = new OpenAPIHono();

  // ============================
  // 🔹 SCHEMA
  // ============================
  const PengalamanSchema = z.object({
    id: z.number(),
    karyawan_id: z.string(),
    perusahaan: z.string(),
    posisi: z.string(),
    tahun_mulai: z.number(),
    tahun_selesai: z.number().optional(),
    deskripsi: z.string().optional(),
  });

  const CreateSchema = PengalamanSchema.omit({ id: true });
  const UpdateSchema = CreateSchema.partial();

  const ResponseListSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    data: z.array(PengalamanSchema),
  });

  const ResponseSingleSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    data: PengalamanSchema.nullable(),
  });

  // ============================
  // 🔹 GET ALL
  // ============================
  router.openapi(
    createRoute({
      method: 'get',
      path: '/',
      summary: 'Get all pengalaman',
      tags: ['Pengalaman'],
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'OK',
          content: { 'application/json': { schema: ResponseListSchema } },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    controller.getAll
  );

  // ============================
  // 🔹 GET BY ID
  // ============================
  router.openapi(
    createRoute({
      method: 'get',
      path: '/{id}',
      summary: 'Get pengalaman by ID',
      tags: ['Pengalaman'],
      security: [{ bearerAuth: [] }],
      request: {
        params: z.object({ id: z.string().openapi({ example: '1' }) }),
      },
      responses: {
        200: {
          description: 'OK',
          content: { 'application/json': { schema: ResponseSingleSchema } },
        },
        404: {
          description: 'Pengalaman tidak ditemukan',
          content: { 'application/json': { schema: ResponseSingleSchema } },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    controller.getById
  );

  // ============================
  // 🔹 CREATE
  // ============================
  router.openapi(
    createRoute({
      method: 'post',
      path: '/',
      summary: 'Create new pengalaman',
      tags: ['Pengalaman'],
      security: [{ bearerAuth: [] }],
      request: {
        body: { content: { 'application/json': { schema: CreateSchema } } },
      },
      responses: {
        201: {
          description: 'Created',
          content: { 'application/json': { schema: ResponseSingleSchema } },
        },
        400: {
          description: 'Validasi gagal',
          content: { 'application/json': { schema: ResponseSingleSchema } },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    controller.create
  );

  // ============================
  // 🔹 UPDATE
  // ============================
  router.openapi(
    createRoute({
      method: 'put',
      path: '/{id}',
      summary: 'Update pengalaman',
      tags: ['Pengalaman'],
      security: [{ bearerAuth: [] }],
      request: {
        params: z.object({ id: z.string() }),
        body: { content: { 'application/json': { schema: UpdateSchema } } },
      },
      responses: {
        200: {
          description: 'Updated',
          content: { 'application/json': { schema: ResponseSingleSchema } },
        },
        404: {
          description: 'Pengalaman tidak ditemukan',
          content: { 'application/json': { schema: ResponseSingleSchema } },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    controller.update
  );

  // ============================
  // 🔹 DELETE
  // ============================
  router.openapi(
    createRoute({
      method: 'delete',
      path: '/{id}',
      summary: 'Delete pengalaman',
      tags: ['Pengalaman'],
      security: [{ bearerAuth: [] }],
      request: { params: z.object({ id: z.string() }) },
      responses: {
        200: {
          description: 'Deleted',
          content: { 'application/json': { schema: ResponseSingleSchema } },
        },
        404: {
          description: 'Pengalaman tidak ditemukan',
          content: { 'application/json': { schema: ResponseSingleSchema } },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    controller.remove
  );

  // ============================
  // 🔹 REGISTER ROUTER
  // ============================
  app.route('/pengalaman', router);
};

export default prsPengalamanRoutes;
