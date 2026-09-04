// import { Hono } from 'hono';
// import {
//   getAllStatusKaryawan,
//   getStatusKaryawanById,
//   createStatusKaryawan,
//   updateStatusKaryawan,
//   deleteStatusKaryawan,
// } from '../controllers/prsStatusKaryawanController';

// const router = new Hono();

// import { clerkAuthMiddleware } from '../middlewares/clerkAuth';
// const app = new Hono();
// app.use('*', clerkAuthMiddleware);

// router.get('/', clerkAuthMiddleware, getAllStatusKaryawan);
// router.get('/:id', clerkAuthMiddleware, getStatusKaryawanById);
// router.post('/', clerkAuthMiddleware, createStatusKaryawan);
// router.put('/:id', clerkAuthMiddleware, updateStatusKaryawan);
// router.delete('/:id', clerkAuthMiddleware, deleteStatusKaryawan);

// export default router;

import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { z } from 'zod';
import {
  getAllStatusKaryawan,
  getStatusKaryawanById,
  createStatusKaryawan,
  updateStatusKaryawan,
  deleteStatusKaryawan,
} from '../controllers/prsStatusKaryawanController';
import { clerkAuthMiddleware } from '../middlewares/clerkAuth';

export const prsStatusKaryawanRoutes = (app: OpenAPIHono) => {
  app.use('*', clerkAuthMiddleware);
  const router = new OpenAPIHono();

  // ============================
  // 🔹 SCHEMA
  // ============================
  const StatusKaryawanSchema = z.object({
    id: z.number(),
    nama_status: z.string(),
  });

  const CreateSchema = StatusKaryawanSchema.omit({ id: true });
  const UpdateSchema = CreateSchema.partial();

  const ResponseListSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    data: z.array(StatusKaryawanSchema),
  });

  const ResponseSingleSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    data: StatusKaryawanSchema.nullable(),
  });

  // ============================
  // 🔹 GET ALL
  // ============================
  router.openapi(
    createRoute({
      method: 'get',
      path: '/',
      summary: 'Get all status karyawan',
      tags: ['Status Karyawan'],
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'OK',
          content: { 'application/json': { schema: ResponseListSchema } },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    getAllStatusKaryawan
  );

  // ============================
  // 🔹 GET BY ID
  // ============================
  router.openapi(
    createRoute({
      method: 'get',
      path: '/{id}',
      summary: 'Get status karyawan by ID',
      tags: ['Status Karyawan'],
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
          description: 'Data tidak ditemukan',
          content: { 'application/json': { schema: ResponseSingleSchema } },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    getStatusKaryawanById
  );

  // ============================
  // 🔹 CREATE
  // ============================
  router.openapi(
    createRoute({
      method: 'post',
      path: '/',
      summary: 'Create new status karyawan',
      tags: ['Status Karyawan'],
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
    createStatusKaryawan
  );

  // ============================
  // 🔹 UPDATE
  // ============================
  router.openapi(
    createRoute({
      method: 'put',
      path: '/{id}',
      summary: 'Update status karyawan',
      tags: ['Status Karyawan'],
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
          description: 'Data tidak ditemukan',
          content: { 'application/json': { schema: ResponseSingleSchema } },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    updateStatusKaryawan
  );

  // ============================
  // 🔹 DELETE
  // ============================
  router.openapi(
    createRoute({
      method: 'delete',
      path: '/{id}',
      summary: 'Delete status karyawan',
      tags: ['Status Karyawan'],
      security: [{ bearerAuth: [] }],
      request: { params: z.object({ id: z.string() }) },
      responses: {
        200: {
          description: 'Deleted',
          content: { 'application/json': { schema: ResponseSingleSchema } },
        },
        404: {
          description: 'Data tidak ditemukan',
          content: { 'application/json': { schema: ResponseSingleSchema } },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    deleteStatusKaryawan
  );

  // ============================
  // 🔹 REGISTER ROUTER
  // ============================
  app.route('/status-karyawan', router);
};

export default prsStatusKaryawanRoutes;
