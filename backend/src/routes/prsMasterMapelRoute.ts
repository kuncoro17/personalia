// import { Hono } from 'hono';
// import {
//   getAllMapel,
//   getMapelById,
//   createMapel,
//   updateMapel,
//   deleteMapel,
// } from '../controllers/PrsMasterMapelController';

// import { clerkAuthMiddleware } from '../middlewares/clerkAuth';
// const app = new Hono();
// app.use('*', clerkAuthMiddleware);

// const router = new Hono();

// router.get('/', clerkAuthMiddleware, getAllMapel);
// router.get('/:id', clerkAuthMiddleware, getMapelById);
// router.post('/', clerkAuthMiddleware, createMapel);
// router.put('/:id', clerkAuthMiddleware, updateMapel);
// router.delete('/:id', clerkAuthMiddleware, deleteMapel);

// export default router;

import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { z } from 'zod';
import {
  getAllMapel,
  getMapelById,
  createMapel,
  updateMapel,
  deleteMapel,
} from '../controllers/PrsMasterMapelController';
import { clerkAuthMiddleware } from '../middlewares/clerkAuth';

export const PrsMasterMapelRoutes = (app: OpenAPIHono) => {
  app.use('*', clerkAuthMiddleware);
  const basePath = '/master-mapel';
  const router = new OpenAPIHono();

  // ============================
  // 🔹 SCHEMAS
  // ============================
  const MapelSchema = z.object({
    id: z.string().uuid(),
    kode: z.string(),
    nama: z.string(),
  });

  const CreateSchema = MapelSchema.omit({ id: true });
  const UpdateSchema = CreateSchema.partial();

  const ResponseListSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    data: z.array(MapelSchema),
  });

  const ResponseSingleSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    data: MapelSchema.nullable(),
  });

  // ============================
  // 🔹 GET ALL MAPEL
  // ============================
  router.openapi(
    createRoute({
      method: 'get',
      path: '/GetAllMapel',
      summary: 'Get all mapel',
      tags: ['Mapel'],
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Berhasil mengambil semua mapel',
          content: { 'application/json': { schema: ResponseListSchema } },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    getAllMapel
  );

  // ============================
  // 🔹 GET MAPEL BY ID
  // ============================
  router.openapi(
    createRoute({
      method: 'get',
      path: '/{id}',
      summary: 'Get mapel by ID',
      tags: ['Mapel'],
      security: [{ bearerAuth: [] }],
      request: { params: z.object({ id: z.string().uuid() }) },
      responses: {
        200: {
          description: 'Berhasil mengambil mapel',
          content: { 'application/json': { schema: ResponseSingleSchema } },
        },
        404: {
          description: 'Mapel tidak ditemukan',
          content: { 'application/json': { schema: ResponseSingleSchema } },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    getMapelById
  );

  // ============================
  // 🔹 CREATE MAPEL
  // ============================
  router.openapi(
    createRoute({
      method: 'post',
      path: '/',
      summary: 'Create new mapel',
      tags: ['Mapel'],
      security: [{ bearerAuth: [] }],
      request: {
        body: { content: { 'application/json': { schema: CreateSchema } } },
      },
      responses: {
        201: {
          description: 'Mapel berhasil dibuat',
          content: { 'application/json': { schema: ResponseSingleSchema } },
        },
        400: {
          description: 'Validasi gagal',
          content: { 'application/json': { schema: ResponseSingleSchema } },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    createMapel
  );

  // ============================
  // 🔹 UPDATE MAPEL
  // ============================
  router.openapi(
    createRoute({
      method: 'put',
      path: '/{id}',
      summary: 'Update mapel',
      tags: ['Mapel'],
      security: [{ bearerAuth: [] }],
      request: {
        params: z.object({ id: z.string().uuid() }),
        body: { content: { 'application/json': { schema: UpdateSchema } } },
      },
      responses: {
        200: {
          description: 'Mapel berhasil diperbarui',
          content: { 'application/json': { schema: ResponseSingleSchema } },
        },
        404: {
          description: 'Mapel tidak ditemukan',
          content: { 'application/json': { schema: ResponseSingleSchema } },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    updateMapel
  );

  // ============================
  // 🔹 DELETE MAPEL
  // ============================
  router.openapi(
    createRoute({
      method: 'delete',
      path: '/{id}',
      summary: 'Delete mapel',
      tags: ['Mapel'],
      security: [{ bearerAuth: [] }],
      request: { params: z.object({ id: z.string().uuid() }) },
      responses: {
        200: {
          description: 'Mapel berhasil dihapus',
          content: { 'application/json': { schema: ResponseSingleSchema } },
        },
        404: {
          description: 'Mapel tidak ditemukan',
          content: { 'application/json': { schema: ResponseSingleSchema } },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    deleteMapel
  );

  // REGISTER PREFIX
  app.route(basePath, router);
};

export default PrsMasterMapelRoutes;
