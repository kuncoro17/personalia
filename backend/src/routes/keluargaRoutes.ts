// import { Hono } from 'hono';
// import {
//   getAll,
//   getById,
//   create,
//   update,
//   remove,
//   getByKaryawanId,
// } from '../controllers/prsKeluargaController';

// import { clerkAuthMiddleware } from '../middlewares/clerkAuth';
// const app = new Hono();
// app.use('*', clerkAuthMiddleware);

// const router = new Hono();

// router.get('/', clerkAuthMiddleware, getAll);
// router.get('/:id', clerkAuthMiddleware, getById);
// router.post('/', clerkAuthMiddleware, create);
// router.put('/:id', clerkAuthMiddleware, update);
// router.delete('/:id', clerkAuthMiddleware, remove);
// router.get('/karyawan_id/:karyawan_id', clerkAuthMiddleware, getByKaryawanId);
// export default router;

import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { z } from 'zod';
import * as controller from '../controllers/prsKeluargaController';
import { clerkAuthMiddleware } from '../middlewares/clerkAuth';

export const prsKeluargaRoutes = (app: OpenAPIHono) => {
  app.use('*', clerkAuthMiddleware);

  /* =======================
   * SCHEMA
   * ======================= */
  const keluargaSchema = z.object({
    id: z.string().uuid(),
    karyawan_id: z.string().uuid(),
    nama_lengkap: z.string().optional(),
    nomor_identitas: z.string().optional(),
    tempat_lahir: z.string().optional(),
    no_telp: z.string().optional(),
    tanggal_lahir: z.string().optional(),
    agama: z.number().optional(),
    kewarganegaraan: z.string().optional(),
    pekerjaan: z.string().optional(),
    pendidikan: z.string().optional(),
    gender: z.string().optional(),
    hubungan: z.string().optional(),
    flag_status: z.number().optional(),
    tanggungan_medical: z.number().optional(),
    kebijakan_khusus_medical: z.number().optional(),
    flag_berpisah: z.number().optional(),
    keterangan: z.string().optional(),
  });

  const createSchema = keluargaSchema.omit({ id: true });
  const updateSchema = createSchema.partial();

  const responseListSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    data: z.array(keluargaSchema),
  });

  const responseSingleSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    data: keluargaSchema.nullable(),
  });

  /* =======================
   * ROUTES
   * ======================= */

  // GET ALL
  app.openapi(
    createRoute({
      method: 'get',
      path: '/personalia/keluarga',
      summary: 'Get all Keluarga',
      tags: ['Keluarga'],
      responses: {
        200: {
          description: 'OK',
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
      path: '/personalia/keluarga/{id}',
      summary: 'Get Keluarga by ID',
      tags: ['Keluarga'],
      request: { params: z.object({ id: z.string().uuid() }) },
      responses: {
        200: {
          description: 'Found',
          content: { 'application/json': { schema: responseSingleSchema } },
        },
        404: {
          description: 'Not Found',
          content: { 'application/json': { schema: responseSingleSchema } },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    controller.getById
  );

  // GET BY KARYAWAN ID
  app.openapi(
    createRoute({
      method: 'get',
      path: '/personalia/keluarga/karyawan/{karyawan_id}',
      summary: 'Get Keluarga by Karyawan ID',
      tags: ['Keluarga'],
      request: { params: z.object({ karyawan_id: z.string().uuid() }) },
      responses: {
        200: {
          description: 'OK',
          content: { 'application/json': { schema: responseListSchema } },
        },
        404: {
          description: 'Not Found',
          content: { 'application/json': { schema: responseListSchema } },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    controller.getByKaryawanId
  );

  // CREATE
  app.openapi(
    createRoute({
      method: 'post',
      path: '/personalia/keluarga',
      summary: 'Create Keluarga',
      tags: ['Keluarga'],
      request: {
        body: { content: { 'application/json': { schema: createSchema } } },
      },
      responses: {
        201: {
          description: 'Created',
          content: { 'application/json': { schema: responseSingleSchema } },
        },
        400: { description: 'Bad Request' },
        401: { description: 'Unauthorized' },
      },
    }),
    controller.create
  );

  // UPDATE
  app.openapi(
    createRoute({
      method: 'put',
      path: '/personalia/keluarga/{id}',
      summary: 'Update Keluarga',
      tags: ['Keluarga'],
      request: {
        params: z.object({ id: z.string().uuid() }),
        body: { content: { 'application/json': { schema: updateSchema } } },
      },
      responses: {
        200: {
          description: 'Updated',
          content: { 'application/json': { schema: responseSingleSchema } },
        },
        404: {
          description: 'Not Found',
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
      path: '/personalia/keluarga/{id}',
      summary: 'Delete Keluarga',
      tags: ['Keluarga'],
      request: { params: z.object({ id: z.string().uuid() }) },
      responses: {
        200: {
          description: 'Deleted',
          content: { 'application/json': { schema: responseSingleSchema } },
        },
        404: {
          description: 'Not Found',
          content: { 'application/json': { schema: responseSingleSchema } },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    controller.remove
  );
};

export default prsKeluargaRoutes;
