// import { Hono } from 'hono';
// import {
//   getAllKota,
//   getKotaById,
//   createKota,
//   updateKota,
//   deleteKota,
//   getKotaByIdProv,
// } from '../controllers/prsMasterKotController';

// import { clerkAuthMiddleware } from '../middlewares/clerkAuth';
// const app = new Hono();
// app.use('*', clerkAuthMiddleware);

// const router = new Hono();

// router.get('/', clerkAuthMiddleware, getAllKota);
// router.get('/prov/:id_prov', clerkAuthMiddleware, getKotaByIdProv);
// router.get('/:id', clerkAuthMiddleware, getKotaById);
// router.post('/', clerkAuthMiddleware, createKota);
// router.put('/:id', clerkAuthMiddleware, updateKota);
// router.delete('/:id', clerkAuthMiddleware, deleteKota);

// export default router;

import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { z } from 'zod';
import {
  getAllKota,
  getKotaById,
  createKota,
  updateKota,
  deleteKota,
  getKotaByIdProv,
} from '../controllers/prsMasterKotController';
import { clerkAuthMiddleware } from '../middlewares/clerkAuth';

export const prsMasterKotaRoutes = (app: OpenAPIHono) => {
  app.use('*', clerkAuthMiddleware);
  const basePath = '/master-kota';
  const router = new OpenAPIHono();

  // ============================
  // 🔹 SCHEMAS
  // ============================
  const KotaSchema = z.object({
    id: z.string(),
    prov_id: z.string(),
    nama: z.string(),
  });

  const CreateSchema = KotaSchema.omit({ id: true });
  const UpdateSchema = CreateSchema.partial();

  const ResponseListSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    data: z.array(KotaSchema),
  });

  const ResponseSingleSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    data: KotaSchema.nullable(),
  });

  // ============================
  // 🔹 GET ALL
  // ============================
  router.openapi(
    createRoute({
      method: 'get',
      path: '/',
      summary: 'Get all kota',
      tags: ['Kota'],
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Berhasil mengambil semua kota',
          content: { 'application/json': { schema: ResponseListSchema } },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    getAllKota
  );

  // ============================
  // 🔹 GET BY PROVINSI
  // ============================
  router.openapi(
    createRoute({
      method: 'get',
      path: '/prov/{prov_id}',
      summary: 'Get kota by provinsi ID',
      tags: ['Kota'],
      security: [{ bearerAuth: [] }],
      request: { params: z.object({ prov_id: z.string() }) },
      responses: {
        200: {
          description: 'Berhasil mengambil kota berdasarkan provinsi',
          content: { 'application/json': { schema: ResponseListSchema } },
        },
        404: {
          description: 'Kota tidak ditemukan',
          content: { 'application/json': { schema: ResponseListSchema } },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    getKotaByIdProv
  );

  // ============================
  // 🔹 GET BY ID
  // ============================
  router.openapi(
    createRoute({
      method: 'get',
      path: '/{id}',
      summary: 'Get kota by ID',
      tags: ['Kota'],
      security: [{ bearerAuth: [] }],
      request: { params: z.object({ id: z.string() }) },
      responses: {
        200: {
          description: 'Berhasil mengambil kota',
          content: { 'application/json': { schema: ResponseSingleSchema } },
        },
        404: {
          description: 'Kota tidak ditemukan',
          content: { 'application/json': { schema: ResponseSingleSchema } },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    getKotaById
  );

  // ============================
  // 🔹 CREATE
  // ============================
  router.openapi(
    createRoute({
      method: 'post',
      path: '/',
      summary: 'Create new kota',
      tags: ['Kota'],
      security: [{ bearerAuth: [] }],
      request: {
        body: { content: { 'application/json': { schema: CreateSchema } } },
      },
      responses: {
        201: {
          description: 'Kota berhasil dibuat',
          content: { 'application/json': { schema: ResponseSingleSchema } },
        },
        400: {
          description: 'Validasi gagal',
          content: { 'application/json': { schema: ResponseSingleSchema } },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    createKota
  );

  // ============================
  // 🔹 UPDATE
  // ============================
  router.openapi(
    createRoute({
      method: 'put',
      path: '/{id}',
      summary: 'Update kota',
      tags: ['Kota'],
      security: [{ bearerAuth: [] }],
      request: {
        params: z.object({ id: z.string() }),
        body: { content: { 'application/json': { schema: UpdateSchema } } },
      },
      responses: {
        200: {
          description: 'Kota berhasil diperbarui',
          content: { 'application/json': { schema: ResponseSingleSchema } },
        },
        404: {
          description: 'Kota tidak ditemukan',
          content: { 'application/json': { schema: ResponseSingleSchema } },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    updateKota
  );

  // ============================
  // 🔹 DELETE
  // ============================
  router.openapi(
    createRoute({
      method: 'delete',
      path: '/{id}',
      summary: 'Delete kota',
      tags: ['Kota'],
      security: [{ bearerAuth: [] }],
      request: { params: z.object({ id: z.string() }) },
      responses: {
        200: {
          description: 'Kota berhasil dihapus',
          content: { 'application/json': { schema: ResponseSingleSchema } },
        },
        404: {
          description: 'Kota tidak ditemukan',
          content: { 'application/json': { schema: ResponseSingleSchema } },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    deleteKota
  );

  // REGISTER PREFIX
  app.route(basePath, router);
};

export default prsMasterKotaRoutes;
