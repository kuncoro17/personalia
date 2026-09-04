// import { Hono } from 'hono';
// import * as controller from '../controllers/prsUnitKerjaKaryawanController';
// import prsJamMengajarKaryawanController from '../controllers/prsJamMengajarKaryawanController';
// const router = new Hono();

// import { clerkAuthMiddleware } from '../middlewares/clerkAuth';
// const app = new Hono();
// app.use('*', clerkAuthMiddleware);

// router.get('/', clerkAuthMiddleware, controller.getAll);
// router.get('/:id', clerkAuthMiddleware, controller.getById);
// router.put(
//   '/jabatan/:karyawan_id',
//   clerkAuthMiddleware,
//   controller.updateByJabId
// );
// router.post(
//   '/created',
//   clerkAuthMiddleware,
//   controller.create,
//   prsJamMengajarKaryawanController.create
// );
// router.put('/:id', clerkAuthMiddleware, controller.update);
// router.delete('/:id', clerkAuthMiddleware, controller.remove);

// export default router;

import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { z } from 'zod';
import * as controller from '../controllers/prsUnitKerjaKaryawanController';
import prsJamMengajarKaryawanController from '../controllers/prsJamMengajarKaryawanController';
import { clerkAuthMiddleware } from '../middlewares/clerkAuth';

export const prsUnitKerjaKaryawanRoutes = (app: OpenAPIHono) => {
  app.use('*', clerkAuthMiddleware);
  const router = new OpenAPIHono();

  // ============================
  // 🔹 SCHEMA
  // ============================
  const unitKerjaKaryawanSchema = z.object({
    ukk_id: z.string(),
    karyawan_id: z.string(),
    unit_kerja: z.string(),
    jab_id: z.string(),
    lokasi_penggajian: z.string(),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
    deleted_at: z.string().nullable().optional(),
  });

  const createSchema = unitKerjaKaryawanSchema.omit({
    ukk_id: true,
    created_at: true,
    updated_at: true,
    deleted_at: true,
  });

  const updateSchema = createSchema.partial();

  const responseListSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    data: z.array(unitKerjaKaryawanSchema),
  });

  const responseSingleSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    data: unitKerjaKaryawanSchema.nullable(),
  });

  // ============================
  // 🔹 GET ALL
  // ============================
  router.openapi(
    createRoute({
      method: 'get',
      path: '/',
      summary: 'Get all unit kerja karyawan',
      tags: ['Unit Kerja Karyawan'],
      security: [{ bearerAuth: [] }],
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

  // ============================
  // 🔹 GET BY ID
  // ============================
  router.openapi(
    createRoute({
      method: 'get',
      path: '/{id}',
      summary: 'Get unit kerja karyawan by ID',
      tags: ['Unit Kerja Karyawan'],
      security: [{ bearerAuth: [] }],
      request: { params: z.object({ id: z.string() }) },
      responses: {
        200: {
          description: 'OK',
          content: { 'application/json': { schema: responseSingleSchema } },
        },
        404: {
          description: 'Data tidak ditemukan',
          content: { 'application/json': { schema: responseSingleSchema } },
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
      path: '/created',
      summary: 'Create unit kerja karyawan',
      tags: ['Unit Kerja Karyawan'],
      security: [{ bearerAuth: [] }],
      request: {
        body: { content: { 'application/json': { schema: createSchema } } },
      },
      responses: {
        201: {
          description: 'Created',
          content: { 'application/json': { schema: responseSingleSchema } },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    async c => {
      const data = await controller.create(c);
      await prsJamMengajarKaryawanController.create(c); // opsional
      return data;
    }
  );

  // ============================
  // 🔹 UPDATE
  // ============================
  router.openapi(
    createRoute({
      method: 'put',
      path: '/{id}',
      summary: 'Update unit kerja karyawan',
      tags: ['Unit Kerja Karyawan'],
      security: [{ bearerAuth: [] }],
      request: {
        params: z.object({ id: z.string() }),
        body: { content: { 'application/json': { schema: updateSchema } } },
      },
      responses: {
        200: {
          description: 'Updated',
          content: { 'application/json': { schema: responseSingleSchema } },
        },
        404: {
          description: 'Data tidak ditemukan',
          content: { 'application/json': { schema: responseSingleSchema } },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    controller.update
  );

  // ============================
  // 🔹 UPDATE BY JABATAN
  // ============================
  router.openapi(
    createRoute({
      method: 'put',
      path: '/jabatan/{karyawan_id}',
      summary: 'Update unit kerja by jabatan',
      tags: ['Unit Kerja Karyawan'],
      security: [{ bearerAuth: [] }],
      request: {
        params: z.object({ karyawan_id: z.string() }),
        body: { content: { 'application/json': { schema: updateSchema } } },
      },
      responses: {
        200: {
          description: 'Updated',
          content: { 'application/json': { schema: responseSingleSchema } },
        },
        404: {
          description: 'Data tidak ditemukan',
          content: { 'application/json': { schema: responseSingleSchema } },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    controller.updateByJabId
  );

  // ============================
  // 🔹 DELETE
  // ============================
  router.openapi(
    createRoute({
      method: 'delete',
      path: '/{id}',
      summary: 'Delete unit kerja karyawan',
      tags: ['Unit Kerja Karyawan'],
      security: [{ bearerAuth: [] }],
      request: { params: z.object({ id: z.string() }) },
      responses: {
        200: {
          description: 'Deleted',
          content: { 'application/json': { schema: responseSingleSchema } },
        },
        404: {
          description: 'Data tidak ditemukan',
          content: { 'application/json': { schema: responseSingleSchema } },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    controller.remove
  );

  // ============================
  // 🔹 REGISTER ROUTER
  // ============================
  app.route('/unit-kerja-karyawan', router);
};

export default prsUnitKerjaKaryawanRoutes;
