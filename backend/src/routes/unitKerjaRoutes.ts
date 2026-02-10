// import { Hono } from 'hono';
// import * as controller from '../controllers/prsUnitKerjaController';
// import { clerkAuthMiddleware } from '../middlewares/clerkAuth';
// const app = new Hono();
// app.use('*', clerkAuthMiddleware);
// const router = new Hono();

// router.get('/getall', clerkAuthMiddleware, controller.getAll);
// router.get('/getllUnitKerja', clerkAuthMiddleware, controller.getAllUnitKerja1);
// router.get('/getallmaster', clerkAuthMiddleware, controller.getJoinedUnitKerja);
// router.get('/:id', clerkAuthMiddleware, controller.getById);
// router.post('/created', clerkAuthMiddleware, controller.createUnitKerja);
// router.put('/:id', clerkAuthMiddleware, controller.update);
// router.delete('/:id', clerkAuthMiddleware, controller.remove);

// export default router;

import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { z } from 'zod';
import * as controller from '../controllers/prsUnitKerjaController';
import { clerkAuthMiddleware } from '../middlewares/clerkAuth';

export const prsUnitKerjaRoutes = (app: OpenAPIHono) => {
  app.use('*', clerkAuthMiddleware);

  /* =======================
   * SCHEMA
   * ======================= */
  const unitKerjaSchema = z.object({
    id: z.string(),
    kode_unit: z.string(),
    nama_unit: z.string(),
    lokasi: z.string().optional(),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
  });

  const createSchema = unitKerjaSchema.omit({
    id: true,
    created_at: true,
    updated_at: true,
  });

  const updateSchema = createSchema.partial();

  const responseListSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    data: z.array(unitKerjaSchema),
  });

  const responseSingleSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    data: unitKerjaSchema.nullable(),
  });

  /* =======================
   * ROUTES
   * ======================= */

  // GET ALL
  app.openapi(
    createRoute({
      method: 'get',
      path: '/unit-kerja/getall',
      summary: 'Get all Unit Kerja',
      tags: ['Unit Kerja'],
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

  // GET ALL UNIT KERJA 1
  app.openapi(
    createRoute({
      method: 'get',
      path: '/unit-kerja/getllUnitKerja',
      summary: 'Get all Unit Kerja 1',
      tags: ['Unit Kerja'],
      responses: {
        200: {
          description: 'OK',
          content: { 'application/json': { schema: responseListSchema } },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    controller.getAllUnitKerja1
  );

  // GET JOINED UNIT KERJA
  app.openapi(
    createRoute({
      method: 'get',
      path: '/unit-kerja/getallmaster',
      summary: 'Get joined Unit Kerja',
      tags: ['Unit Kerja'],
      responses: {
        200: {
          description: 'OK',
          content: { 'application/json': { schema: responseListSchema } },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    controller.getJoinedUnitKerja
  );

  // GET BY ID
  app.openapi(
    createRoute({
      method: 'get',
      path: '/unit-kerja/{id}',
      summary: 'Get Unit Kerja by ID',
      tags: ['Unit Kerja'],
      request: { params: z.object({ id: z.string() }) },
      responses: {
        200: {
          description: 'Found',
          content: { 'application/json': { schema: responseSingleSchema } },
        },
        404: {
          description: 'Not found',
          content: { 'application/json': { schema: responseSingleSchema } },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    controller.getById
  );

  // CREATE
  app.openapi(
    createRoute({
      method: 'post',
      path: '/unit-kerja/created',
      summary: 'Create new Unit Kerja',
      tags: ['Unit Kerja'],
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
    controller.createUnitKerja
  );

  // UPDATE
  app.openapi(
    createRoute({
      method: 'put',
      path: '/unit-kerja/{id}',
      summary: 'Update Unit Kerja',
      tags: ['Unit Kerja'],
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
          description: 'Not found',
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
      path: '/unit-kerja/{id}',
      summary: 'Delete Unit Kerja',
      tags: ['Unit Kerja'],
      request: { params: z.object({ id: z.string() }) },
      responses: {
        200: {
          description: 'Deleted',
          content: { 'application/json': { schema: responseSingleSchema } },
        },
        404: {
          description: 'Not found',
          content: { 'application/json': { schema: responseSingleSchema } },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    controller.remove
  );
};

export default prsUnitKerjaRoutes;
