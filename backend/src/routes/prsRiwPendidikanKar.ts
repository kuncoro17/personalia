// import { Hono } from 'hono';
// import {
//   getAllRiwPendidikanKar,
//   getRiwPendidikanKarById,
//   createRiwPendidikanKar,
//   updateRiwPendidikanKar,
//   deleteRiwPendidikanKar,
// } from '../controllers/prsRiwPendidikanKarController';

// import { clerkAuthMiddleware } from '../middlewares/clerkAuth';
// const app = new Hono();
// app.use('*', clerkAuthMiddleware);

// const router = new Hono();

// router.get('/', clerkAuthMiddleware, getAllRiwPendidikanKar);
// router.get('/:id', clerkAuthMiddleware, getRiwPendidikanKarById);
// router.post('/', clerkAuthMiddleware, createRiwPendidikanKar);
// router.put('/:id', clerkAuthMiddleware, updateRiwPendidikanKar);
// router.delete('/:id', clerkAuthMiddleware, deleteRiwPendidikanKar);

// export default router;

import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { z } from 'zod';
import controller from '../controllers/prsRiwPendidikanKarController';
import { clerkAuthMiddleware } from '../middlewares/clerkAuth';

export const prsRiwPendidikanKarRoutes = (app: OpenAPIHono) => {
  app.use('*', clerkAuthMiddleware);
  const router = new OpenAPIHono();

  // ============================
  // 🔹 SCHEMA
  // ============================
  const PendidikanKarSchema = z.object({
    id: z.string().uuid().optional(),
    karyawan_id: z.string().optional(),
    univ: z.string().optional(),
    rpk_id: z.string(),
    ipk: z.string(),
    tingkat: z.string().optional(),
    nama_sekolah: z.string().optional(),
    jurusan: z.string().optional(),
    tahun_kelulusan: z.number().optional(),
  });

  const CreateSchema = PendidikanKarSchema.omit({ id: true });
  const UpdateSchema = CreateSchema.partial();

  const ResponseListSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    data: z.array(PendidikanKarSchema),
  });

  const ResponseSingleSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    data: PendidikanKarSchema.nullable(),
  });

  // ============================
  // 🔹 GET ALL
  // ============================
  router.openapi(
    createRoute({
      method: 'get',
      path: '/',
      summary: 'Get all riwayat pendidikan karyawan',
      tags: ['Riwayat Pendidikan Karyawan'],
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'OK',
          content: { 'application/json': { schema: ResponseListSchema } },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    controller.getAllRiwPendidikanKar
  );

  // ============================
  // 🔹 GET BY ID
  // ============================
  router.openapi(
    createRoute({
      method: 'get',
      path: '/{id}',
      summary: 'Get riwayat pendidikan karyawan by ID',
      tags: ['Riwayat Pendidikan Karyawan'],
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
    controller.getRiwPendidikanKarById
  );

  // ============================
  // 🔹 CREATE
  // ============================
  router.openapi(
    createRoute({
      method: 'post',
      path: '/',
      summary: 'Create new riwayat pendidikan karyawan',
      tags: ['Riwayat Pendidikan Karyawan'],
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
    controller.createRiwPendidikanKar
  );

  // ============================
  // 🔹 UPDATE BY ID
  // ============================
  router.openapi(
    createRoute({
      method: 'put',
      path: '/{id}',
      summary: 'Update riwayat pendidikan karyawan',
      tags: ['Riwayat Pendidikan Karyawan'],
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
    controller.updateRiwPendidikanKar
  );

  // ============================
  // 🔹 UPDATE DETAIL BY KARYAWAN & RPK_ID
  // ============================
  router.openapi(
    createRoute({
      method: 'put',
      path: '/pendidikan/{karyawan_id}/{rpk_id}',
      summary: 'Update riwayat pendidikan karyawan detail',
      tags: ['Riwayat Pendidikan Karyawan'],
      security: [{ bearerAuth: [] }],
      request: {
        params: z.object({ karyawan_id: z.string(), rpk_id: z.string() }),
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
    controller.updateRiwPendidikanKardetail
  );

  // ============================
  // 🔹 DELETE
  // ============================
  router.openapi(
    createRoute({
      method: 'delete',
      path: '/{id}',
      summary: 'Delete riwayat pendidikan karyawan',
      tags: ['Riwayat Pendidikan Karyawan'],
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
    controller.deleteRiwPendidikanKar
  );

  // ============================
  // 🔹 REGISTER ROUTER
  // ============================
  app.route('/riw-pendidikan-kar', router);
};

export default prsRiwPendidikanKarRoutes;
