// import { Hono } from 'hono';
// import {
//   getAllKelurahan,
//   getKelurahanById,
//   createKelurahan,
//   updateKelurahan,
//   deleteKelurahan,
//   getKelurahanByKecId,
// } from '../controllers/prsMasterKelController';

// import { clerkAuthMiddleware } from '../middlewares/clerkAuth';
// const app = new Hono();
// app.use('*', clerkAuthMiddleware);

// const router = new Hono();

// router.get('/', clerkAuthMiddleware, getAllKelurahan);
// router.get('/kec/:kec_id', clerkAuthMiddleware, getKelurahanByKecId);
// router.get('/:id', clerkAuthMiddleware, getKelurahanById);
// router.post('/', clerkAuthMiddleware, createKelurahan);
// router.put('/:id', clerkAuthMiddleware, updateKelurahan);
// router.delete('/:id', clerkAuthMiddleware, deleteKelurahan);

// export default router;
import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { z } from 'zod';
import {
  getAllKelurahan,
  getKelurahanById,
  createKelurahan,
  updateKelurahan,
  deleteKelurahan,
  getKelurahanByKecId,
} from '../controllers/prsMasterKelController';
import { clerkAuthMiddleware } from '../middlewares/clerkAuth';

export const prsMasterKelRoutes = (app: OpenAPIHono) => {
  app.use('*', clerkAuthMiddleware);
  const router = new OpenAPIHono();

  // ============================
  // 🔹 SCHEMAS
  // ============================
  const KelurahanSchema = z.object({
    id: z.number(),
    kec_id: z.number(),
    nama: z.string(),
  });

  const CreateSchema = KelurahanSchema.omit({ id: true });
  const UpdateSchema = CreateSchema.partial();

  const ResponseListSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    data: z.array(KelurahanSchema),
  });

  const ResponseSingleSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    data: KelurahanSchema.nullable(),
  });

  // ============================
  // 🔹 GET ALL
  // ============================
  router.openapi(
    createRoute({
      method: 'get',
      path: '/',
      summary: 'Get all kelurahan',
      tags: ['Kelurahan'],
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Berhasil mengambil semua kelurahan',
          content: { 'application/json': { schema: ResponseListSchema } },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    getAllKelurahan
  );

  // ============================
  // 🔹 GET BY KECAMATAN ID
  // ============================
  router.openapi(
    createRoute({
      method: 'get',
      path: '/ByKecamatan/{kec_id}',
      summary: 'Get kelurahan by kecamatan ID',
      tags: ['Kelurahan'],
      security: [{ bearerAuth: [] }],
      request: {
        params: z.object({ kec_id: z.string().openapi({ example: '10' }) }),
      },
      responses: {
        200: {
          description: 'Berhasil mengambil kelurahan berdasarkan kecamatan',
          content: { 'application/json': { schema: ResponseListSchema } },
        },
        404: {
          description: 'Kelurahan tidak ditemukan',
          content: { 'application/json': { schema: ResponseListSchema } },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    getKelurahanByKecId
  );

  // ============================
  // 🔹 GET BY ID
  // ============================
  router.openapi(
    createRoute({
      method: 'get',
      path: '/{id}',
      summary: 'Get kelurahan by ID',
      tags: ['Kelurahan'],
      security: [{ bearerAuth: [] }],
      request: {
        params: z.object({ id: z.string().openapi({ example: '5' }) }),
      },
      responses: {
        200: {
          description: 'Berhasil mengambil kelurahan',
          content: { 'application/json': { schema: ResponseSingleSchema } },
        },
        404: {
          description: 'Kelurahan tidak ditemukan',
          content: { 'application/json': { schema: ResponseSingleSchema } },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    getKelurahanById
  );

  // ============================
  // 🔹 CREATE
  // ============================
  router.openapi(
    createRoute({
      method: 'post',
      path: '/',
      summary: 'Create new kelurahan',
      tags: ['Kelurahan'],
      security: [{ bearerAuth: [] }],
      request: {
        body: { content: { 'application/json': { schema: CreateSchema } } },
      },
      responses: {
        201: {
          description: 'Kelurahan berhasil dibuat',
          content: { 'application/json': { schema: ResponseSingleSchema } },
        },
        400: {
          description: 'Validasi gagal',
          content: { 'application/json': { schema: ResponseSingleSchema } },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    createKelurahan
  );

  // ============================
  // 🔹 UPDATE
  // ============================
  router.openapi(
    createRoute({
      method: 'put',
      path: '/{id}',
      summary: 'Update kelurahan',
      tags: ['Kelurahan'],
      security: [{ bearerAuth: [] }],
      request: {
        params: z.object({ id: z.string() }),
        body: { content: { 'application/json': { schema: UpdateSchema } } },
      },
      responses: {
        200: {
          description: 'Kelurahan berhasil diperbarui',
          content: { 'application/json': { schema: ResponseSingleSchema } },
        },
        404: {
          description: 'Kelurahan tidak ditemukan',
          content: { 'application/json': { schema: ResponseSingleSchema } },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    updateKelurahan
  );

  // ============================
  // 🔹 DELETE
  // ============================
  router.openapi(
    createRoute({
      method: 'delete',
      path: '/{id}',
      summary: 'Delete kelurahan',
      tags: ['Kelurahan'],
      security: [{ bearerAuth: [] }],
      request: { params: z.object({ id: z.string() }) },
      responses: {
        200: {
          description: 'Kelurahan berhasil dihapus',
          content: { 'application/json': { schema: ResponseSingleSchema } },
        },
        404: {
          description: 'Kelurahan tidak ditemukan',
          content: { 'application/json': { schema: ResponseSingleSchema } },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    deleteKelurahan
  );

  // ============================
  // 🔹 REGISTER ROUTER
  // ============================
  app.route('/master-kelurahan', router);
};

export default prsMasterKelRoutes;
