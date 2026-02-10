// import { Hono } from 'hono';
// import {
//   getAllProvinsi,
//   getProvinsiById,
//   createProvinsi,
//   updateProvinsi,
//   deleteProvinsi,
// } from '../controllers/prsMasterProvController';

// import { clerkAuthMiddleware } from '../middlewares/clerkAuth';
// const app = new Hono();
// app.use('*', clerkAuthMiddleware);

// const router = new Hono();

// router.get('/', clerkAuthMiddleware, getAllProvinsi);
// router.get('/:id', clerkAuthMiddleware, getProvinsiById);
// router.post('/', clerkAuthMiddleware, createProvinsi);
// router.put('/:id', clerkAuthMiddleware, updateProvinsi);
// router.delete('/:id', clerkAuthMiddleware, deleteProvinsi);

// export default router;

import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { z } from 'zod';
import {
  getAllProvinsi,
  getProvinsiById,
  createProvinsi,
  updateProvinsi,
  deleteProvinsi,
} from '../controllers/prsMasterProvController';
import { clerkAuthMiddleware } from '../middlewares/clerkAuth';

export const prsMasterProvRoutes = (app: OpenAPIHono) => {
  app.use('*', clerkAuthMiddleware);
  const router = new OpenAPIHono();

  // ============================
  // 🔹 SCHEMAS
  // ============================
  const ProvinsiSchema = z.object({
    id: z.number(),
    nama: z.string(),
  });

  const CreateSchema = ProvinsiSchema.omit({ id: true });
  const UpdateSchema = CreateSchema.partial();

  const ResponseListSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    data: z.array(ProvinsiSchema),
  });

  const ResponseSingleSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    data: ProvinsiSchema.nullable(),
  });

  // ============================
  // 🔹 GET ALL
  // ============================
  router.openapi(
    createRoute({
      method: 'get',
      path: '/',
      summary: 'Get all provinsi',
      tags: ['Provinsi'],
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Berhasil mengambil semua provinsi',
          content: { 'application/json': { schema: ResponseListSchema } },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    getAllProvinsi
  );

  // ============================
  // 🔹 GET BY ID
  // ============================
  router.openapi(
    createRoute({
      method: 'get',
      path: '/{id}',
      summary: 'Get provinsi by ID',
      tags: ['Provinsi'],
      security: [{ bearerAuth: [] }],
      request: {
        params: z.object({ id: z.string().openapi({ example: '1' }) }),
      },
      responses: {
        200: {
          description: 'Berhasil mengambil provinsi',
          content: { 'application/json': { schema: ResponseSingleSchema } },
        },
        404: {
          description: 'Provinsi tidak ditemukan',
          content: { 'application/json': { schema: ResponseSingleSchema } },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    getProvinsiById
  );

  // ============================
  // 🔹 CREATE
  // ============================
  router.openapi(
    createRoute({
      method: 'post',
      path: '/',
      summary: 'Create new provinsi',
      tags: ['Provinsi'],
      security: [{ bearerAuth: [] }],
      request: {
        body: { content: { 'application/json': { schema: CreateSchema } } },
      },
      responses: {
        201: {
          description: 'Provinsi berhasil dibuat',
          content: { 'application/json': { schema: ResponseSingleSchema } },
        },
        400: {
          description: 'Validasi gagal',
          content: { 'application/json': { schema: ResponseSingleSchema } },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    createProvinsi
  );

  // ============================
  // 🔹 UPDATE
  // ============================
  router.openapi(
    createRoute({
      method: 'put',
      path: '/{id}',
      summary: 'Update provinsi',
      tags: ['Provinsi'],
      security: [{ bearerAuth: [] }],
      request: {
        params: z.object({ id: z.string() }),
        body: { content: { 'application/json': { schema: UpdateSchema } } },
      },
      responses: {
        200: {
          description: 'Provinsi berhasil diperbarui',
          content: { 'application/json': { schema: ResponseSingleSchema } },
        },
        404: {
          description: 'Provinsi tidak ditemukan',
          content: { 'application/json': { schema: ResponseSingleSchema } },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    updateProvinsi
  );

  // ============================
  // 🔹 DELETE
  // ============================
  router.openapi(
    createRoute({
      method: 'delete',
      path: '/{id}',
      summary: 'Delete provinsi',
      tags: ['Provinsi'],
      security: [{ bearerAuth: [] }],
      request: { params: z.object({ id: z.string() }) },
      responses: {
        200: {
          description: 'Provinsi berhasil dihapus',
          content: { 'application/json': { schema: ResponseSingleSchema } },
        },
        404: {
          description: 'Provinsi tidak ditemukan',
          content: { 'application/json': { schema: ResponseSingleSchema } },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    deleteProvinsi
  );

  // REGISTER PREFIX
  app.route('/master-provinsi', router);
};

export default prsMasterProvRoutes;
