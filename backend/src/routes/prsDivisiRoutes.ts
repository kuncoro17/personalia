// import { Hono } from 'hono';
// import * as controller from '../controllers/prsDivisiController';

// import { clerkAuthMiddleware } from '../middlewares/clerkAuth';
// const app = new Hono();
// app.use('*', clerkAuthMiddleware);

// const router = new Hono();

// router.get('/', clerkAuthMiddleware, controller.getAll);
// router.get('/:id', clerkAuthMiddleware, controller.getById);
// router.post('/', clerkAuthMiddleware, controller.create);
// router.put('/:id', clerkAuthMiddleware, controller.update);
// router.delete('/:id', clerkAuthMiddleware, controller.remove);

// export default router;

import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { z } from 'zod';
import * as controller from '../controllers/prsDivisiController';
import { clerkAuthMiddleware } from '../middlewares/clerkAuth';

export const prsDivisiRoutes = (app: OpenAPIHono) => {
  app.use('*', clerkAuthMiddleware);

  // ============================
  // SCHEMA DEFINITIONS
  // ============================
  const divisiSchema = z
    .object({
      id: z.string().uuid().optional(),
      kode_divisi: z.string().max(5),
      nama_divisi: z.string(),
    })
    .openapi('Divisi');

  const divisiBodySchema = divisiSchema.omit({ id: true });
  const divisiArraySchema = z.array(divisiSchema).openapi('DivisiArray');

  // ============================
  // ROUTES
  // ============================

  // GET ALL
  app.openapi(
    createRoute({
      method: 'get',
      path: '/personalia/divisi',
      summary: 'Get all Divisi',
      tags: ['Divisi'],
      responses: {
        200: {
          description: 'Berhasil mengambil semua divisi',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean(),
                message: z.string(),
                data: divisiArraySchema,
              }),
            },
          },
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
      path: '/personalia/divisi/{id}',
      summary: 'Get Divisi by ID',
      tags: ['Divisi'],
      request: {
        params: z.object({ id: z.string().uuid() }).openapi('DivisiID'),
      },
      responses: {
        200: {
          description: 'Berhasil mengambil divisi',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean(),
                message: z.string(),
                data: divisiSchema,
              }),
            },
          },
        },
        404: { description: 'Divisi tidak ditemukan' },
        401: { description: 'Unauthorized' },
      },
    }),
    controller.getById
  );

  // POST CREATE
  app.openapi(
    createRoute({
      method: 'post',
      path: '/personalia/divisi',
      summary: 'Create Divisi',
      tags: ['Divisi'],
      request: {
        body: { content: { 'application/json': { schema: divisiBodySchema } } },
      },
      responses: {
        201: {
          description: 'Divisi berhasil dibuat',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean(),
                message: z.string(),
                data: divisiSchema,
              }),
            },
          },
        },
        400: { description: 'Validasi gagal' },
        401: { description: 'Unauthorized' },
      },
    }),
    controller.create
  );

  // PUT UPDATE
  app.openapi(
    createRoute({
      method: 'put',
      path: '/personalia/divisi/{id}',
      summary: 'Update Divisi',
      tags: ['Divisi'],
      request: {
        params: z.object({ id: z.string().uuid() }).openapi('DivisiID'),
        body: { content: { 'application/json': { schema: divisiBodySchema } } },
      },
      responses: {
        200: {
          description: 'Divisi berhasil diperbarui',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean(),
                message: z.string(),
                data: divisiSchema,
              }),
            },
          },
        },
        404: { description: 'Divisi tidak ditemukan' },
        401: { description: 'Unauthorized' },
      },
    }),
    controller.update
  );

  // DELETE
  app.openapi(
    createRoute({
      method: 'delete',
      path: '/personalia/divisi/{id}',
      summary: 'Delete Divisi',
      tags: ['Divisi'],
      request: {
        params: z.object({ id: z.string().uuid() }).openapi('DivisiID'),
      },
      responses: {
        200: { description: 'Divisi berhasil dihapus' },
        404: { description: 'Divisi tidak ditemukan' },
        401: { description: 'Unauthorized' },
      },
    }),
    controller.remove
  );
};

export default prsDivisiRoutes;
