// import { Hono } from 'hono';
// import {
//   getAllJabatan,
//   getJabatanById,
//   createJabatan,
//   updateJabatan,
//   deleteJabatan,
// } from '../controllers/prsJabatanController';

// import { clerkAuthMiddleware } from '../middlewares/clerkAuth';
// const app = new Hono();
// app.use('*', clerkAuthMiddleware);

// const jabatanRoute = new Hono();

// jabatanRoute.get('/getall', clerkAuthMiddleware, getAllJabatan);
// jabatanRoute.get('/:id', clerkAuthMiddleware, getJabatanById);
// jabatanRoute.post('/', clerkAuthMiddleware, createJabatan);
// jabatanRoute.put('/:id', clerkAuthMiddleware, updateJabatan);
// jabatanRoute.delete('/:id', clerkAuthMiddleware, deleteJabatan);

// export default jabatanRoute;

import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { z } from 'zod';
import * as controller from '../controllers/prsJabatanController';
import { clerkAuthMiddleware } from '../middlewares/clerkAuth';

export const prsJabatanRoutes = (app: OpenAPIHono) => {
  app.use('*', clerkAuthMiddleware);

  /* =======================
   * SCHEMA
   * ======================= */
  const jabatanSchema = z.object({
    id: z.number(),
    kode_jabatan: z.string(),
    nama_jabatan: z.string(),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
  });

  const createSchema = jabatanSchema.omit({
    id: true,
    created_at: true,
    updated_at: true,
  });
  const updateSchema = createSchema.partial();

  const responseListSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    data: z.array(jabatanSchema),
  });

  const responseSingleSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    data: jabatanSchema.nullable(),
  });

  const basePath = '/personalia/jabatan';

  /* =======================
   * ROUTES
   * ======================= */

  // GET ALL
  app.openapi(
    createRoute({
      method: 'get',
      path: `${basePath}`,
      summary: 'Get all Jabatan',
      tags: ['Jabatan'],
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'OK',
          content: { 'application/json': { schema: responseListSchema } },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    controller.getAllJabatan
  );

  // GET BY ID
  app.openapi(
    createRoute({
      method: 'get',
      path: `${basePath}/{id}`,
      summary: 'Get Jabatan by ID',
      tags: ['Jabatan'],
      security: [{ bearerAuth: [] }],
      request: { params: z.object({ id: z.string() }) },
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
    controller.getJabatanById
  );

  // CREATE
  app.openapi(
    createRoute({
      method: 'post',
      path: `${basePath}`,
      summary: 'Create new Jabatan',
      tags: ['Jabatan'],
      security: [{ bearerAuth: [] }],
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
    controller.createJabatan
  );

  // UPDATE
  app.openapi(
    createRoute({
      method: 'put',
      path: `${basePath}/{id}`,
      summary: 'Update Jabatan',
      tags: ['Jabatan'],
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
          description: 'Not Found',
          content: { 'application/json': { schema: responseSingleSchema } },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    controller.updateJabatan
  );

  // DELETE
  app.openapi(
    createRoute({
      method: 'delete',
      path: `${basePath}/{id}`,
      summary: 'Delete Jabatan',
      tags: ['Jabatan'],
      security: [{ bearerAuth: [] }],
      request: { params: z.object({ id: z.string() }) },
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
    controller.deleteJabatan
  );
};

export default prsJabatanRoutes;
