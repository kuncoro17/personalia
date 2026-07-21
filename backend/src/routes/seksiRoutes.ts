// import { Hono } from 'hono';
// import * as controller from '../controllers/prsSeksiController';
// import { clerkAuthMiddleware } from '../middlewares/clerkAuth';
// const app = new Hono();
// app.use('*', clerkAuthMiddleware);
// const router = new Hono();

// router.get('/', clerkAuthMiddleware, controller.getAll);
// router.get(
//   '/bagian/:kode_bagian',
//   clerkAuthMiddleware,
//   controller.getByKodeBagian
// );
// router.get('/:id', clerkAuthMiddleware, controller.getById);
// router.post('/', clerkAuthMiddleware, controller.create);
// router.put('/:id', clerkAuthMiddleware, controller.update);
// router.delete('/:id', clerkAuthMiddleware, controller.remove);

// export default router;
import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { z } from 'zod';
import * as controller from '../controllers/prsSeksiController';
import { clerkAuthMiddleware } from '../middlewares/clerkAuth';

export const prsSeksiRoutes = (app: OpenAPIHono) => {
  app.use('*', clerkAuthMiddleware);

  /* =======================
   * SCHEMA
   * ======================= */
  const seksiSchema = z.object({
    sek_id: z.string().uuid(),
    kode: z.string(),
    nama_sek: z.string(),
    alamat: z.string().nullable().optional(),
    created_at: z.string().nullable().optional(),
    updated_at: z.string().nullable().optional(),
  });

  const createSchema = z.object({
    kode: z.string().trim().min(1).max(5),
    nama_sek: z.string().trim().min(1),
    alamat: z.string().optional(),
  });
  const updateSchema = createSchema.partial();

  const responseListSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    data: z.array(seksiSchema),
  });

  const responseSingleSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    data: seksiSchema.nullable(),
  });

  /* =======================
   * ROUTES
   * ======================= */

  // GET ALL
  app.openapi(
    createRoute({
      method: 'get',
      path: '/seksi',
      summary: 'Get all Seksi',
      tags: ['Seksi'],
      responses: {
        200: {
          description: 'Daftar Seksi',
          content: { 'application/json': { schema: responseListSchema } },
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
      path: '/seksi/{id}',
      summary: 'Get Seksi by ID',
      tags: ['Seksi'],
      request: { params: z.object({ id: z.string() }) },
      responses: {
        200: {
          description: 'Seksi ditemukan',
          content: { 'application/json': { schema: responseSingleSchema } },
        },
        404: {
          description: 'Seksi tidak ditemukan',
          content: { 'application/json': { schema: responseSingleSchema } },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    controller.getById
  );

  // GET BY KODE BAGIAN
  app.openapi(
    createRoute({
      method: 'get',
      path: '/seksi/bagian/{kode_bagian}',
      summary: 'Get Seksi by Kode Bagian',
      tags: ['Seksi'],
      request: { params: z.object({ kode_bagian: z.string() }) },
      responses: {
        200: {
          description: 'Seksi ditemukan',
          content: { 'application/json': { schema: responseListSchema } },
        },
        404: {
          description: 'Seksi tidak ditemukan',
          content: { 'application/json': { schema: responseListSchema } },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    controller.getByKodeBagian
  );

  // CREATE
  app.openapi(
    createRoute({
      method: 'post',
      path: '/seksi',
      summary: 'Create Seksi',
      tags: ['Seksi'],
      request: {
        body: { content: { 'application/json': { schema: createSchema } } },
      },
      responses: {
        201: {
          description: 'Seksi berhasil dibuat',
          content: { 'application/json': { schema: responseSingleSchema } },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    controller.create
  );

  // UPDATE
  app.openapi(
    createRoute({
      method: 'put',
      path: '/seksi/{id}',
      summary: 'Update Seksi',
      tags: ['Seksi'],
      request: {
        params: z.object({ id: z.string() }),
        body: { content: { 'application/json': { schema: updateSchema } } },
      },
      responses: {
        200: {
          description: 'Seksi berhasil diupdate',
          content: { 'application/json': { schema: responseSingleSchema } },
        },
        404: {
          description: 'Seksi tidak ditemukan',
          content: { 'application/json': { schema: responseSingleSchema } },
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
      path: '/seksi/{id}',
      summary: 'Delete Seksi',
      tags: ['Seksi'],
      request: { params: z.object({ id: z.string() }) },
      responses: {
        200: {
          description: 'Seksi berhasil dihapus',
          content: { 'application/json': { schema: responseSingleSchema } },
        },
        404: {
          description: 'Seksi tidak ditemukan',
          content: { 'application/json': { schema: responseSingleSchema } },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    controller.remove
  );
};

export default prsSeksiRoutes;
