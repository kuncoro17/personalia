// import { Hono } from 'hono';
// import {
//   getAllKecamatan,
//   getKecamatanById,
//   createKecamatan,
//   updateKecamatan,
//   deleteKecamatan,
//   getKecamatanByKotId,
// } from '../controllers/prsMasterKecController';

// import { clerkAuthMiddleware } from '../middlewares/clerkAuth';
// const app = new Hono();
// app.use('*', clerkAuthMiddleware);

// const router = new Hono();

// router.get('/', clerkAuthMiddleware, getAllKecamatan);
// router.get('/kota/:kot_id', clerkAuthMiddleware, getKecamatanByKotId);
// router.get('/:id', clerkAuthMiddleware, getKecamatanById);
// router.post('/', clerkAuthMiddleware, createKecamatan);
// router.put('/:id', clerkAuthMiddleware, updateKecamatan);
// router.delete('/:id', clerkAuthMiddleware, deleteKecamatan);

// export default router;

import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { z } from 'zod';
import {
  getAllKecamatan,
  getKecamatanById,
  createKecamatan,
  updateKecamatan,
  deleteKecamatan,
  getKecamatanByKotId,
} from '../controllers/prsMasterKecController';
import { clerkAuthMiddleware } from '../middlewares/clerkAuth';

export const prsMasterKecRoutes = (app: OpenAPIHono) => {
  app.use('*', clerkAuthMiddleware);
  const router = new OpenAPIHono();

  // ============================
  // 🔹 SCHEMA
  // ============================
  const KecamatanSchema = z.object({
    id: z.string().uuid(),
    kecamatan: z.string(),
    kot_id: z.string().uuid(),
  });

  const CreateSchema = KecamatanSchema.omit({ id: true });
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
      summary: 'Get all kecamatan',
      tags: ['Master Kecamatan'],
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Berhasil mengambil semua kecamatan',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean().default(true),
                message: z
                  .string()
                  .default('Berhasil mengambil data kecamatan'),
                data: z.array(KecamatanSchema),
              }),
            },
          },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    getAllKecamatan
  );

  // ============================
  // 🔹 GET BY KOTA ID
  // ============================
  router.openapi(
    createRoute({
      method: 'get',
      path: '/kecamatan_kota/{kot_id}',
      summary: 'Get kecamatan by Kota ID',
      tags: ['Master Kecamatan'],
      security: [{ bearerAuth: [] }],
      request: { params: z.object({ kot_id: z.string().uuid() }) },
      responses: {
        200: {
          description: 'Berhasil mengambil kecamatan berdasarkan Kota ID',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean().default(true),
                message: z
                  .string()
                  .default('Berhasil mengambil data kecamatan'),
                data: z.array(KecamatanSchema),
              }),
            },
          },
        },
        404: {
          description: 'Kecamatan tidak ditemukan',
          content: { 'application/json': { schema: ResponseSchema } },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    getKecamatanByKotId
  );

  // ============================
  // 🔹 GET BY ID
  // ============================
  router.openapi(
    createRoute({
      method: 'get',
      path: '/{id}',
      summary: 'Get kecamatan by ID',
      tags: ['Master Kecamatan'],
      security: [{ bearerAuth: [] }],
      request: { params: z.object({ id: z.string().uuid() }) },
      responses: {
        200: {
          description: 'Berhasil mengambil kecamatan',
          content: { 'application/json': { schema: ResponseSchema } },
        },
        404: {
          description: 'Kecamatan tidak ditemukan',
          content: { 'application/json': { schema: ResponseSchema } },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    getKecamatanById
  );

  // ============================
  // 🔹 CREATE
  // ============================
  router.openapi(
    createRoute({
      method: 'post',
      path: '/',
      summary: 'Create new kecamatan',
      tags: ['Master Kecamatan'],
      security: [{ bearerAuth: [] }],
      request: {
        body: { content: { 'application/json': { schema: CreateSchema } } },
      },
      responses: {
        201: {
          description: 'Kecamatan berhasil dibuat',
          content: { 'application/json': { schema: ResponseSchema } },
        },
        400: {
          description: 'Validasi gagal',
          content: { 'application/json': { schema: ResponseSchema } },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    createKecamatan
  );

  // ============================
  // 🔹 UPDATE
  // ============================
  router.openapi(
    createRoute({
      method: 'put',
      path: '/{id}',
      summary: 'Update kecamatan',
      tags: ['Master Kecamatan'],
      security: [{ bearerAuth: [] }],
      request: {
        params: z.object({ id: z.string().uuid() }),
        body: { content: { 'application/json': { schema: UpdateSchema } } },
      },
      responses: {
        200: {
          description: 'Kecamatan berhasil diperbarui',
          content: { 'application/json': { schema: ResponseSchema } },
        },
        404: {
          description: 'Kecamatan tidak ditemukan',
          content: { 'application/json': { schema: ResponseSchema } },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    updateKecamatan
  );

  // ============================
  // 🔹 DELETE
  // ============================
  router.openapi(
    createRoute({
      method: 'delete',
      path: '/{id}',
      summary: 'Delete kecamatan',
      tags: ['Master Kecamatan'],
      security: [{ bearerAuth: [] }],
      request: { params: z.object({ id: z.string().uuid() }) },
      responses: {
        200: {
          description: 'Kecamatan berhasil dihapus',
          content: { 'application/json': { schema: ResponseSchema } },
        },
        404: {
          description: 'Kecamatan tidak ditemukan',
          content: { 'application/json': { schema: ResponseSchema } },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    deleteKecamatan
  );

  // REGISTER PREFIX
  app.route('/master-kecamatan', router);
};

export default prsMasterKecRoutes;
