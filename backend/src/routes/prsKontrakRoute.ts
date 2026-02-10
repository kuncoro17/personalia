// import { Hono } from 'hono';
// import {
//   getAllKontrak,
//   getKontrakById,
//   createKontrak,
//   updateKontrak,
//   deleteKontrak,
// } from '../controllers/prsKontrakController';

// import { clerkAuthMiddleware } from '../middlewares/clerkAuth';
// const app = new Hono();
// app.use('*', clerkAuthMiddleware);

// const router = new Hono();

// router.get('/', clerkAuthMiddleware, getAllKontrak);
// router.get('/:id', clerkAuthMiddleware, getKontrakById);
// router.post('/', clerkAuthMiddleware, createKontrak);
// router.put('/:id', clerkAuthMiddleware, updateKontrak);
// router.delete('/:id', clerkAuthMiddleware, deleteKontrak);

// export default router;

import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { z } from 'zod';
import {
  getAllKontrak,
  getKontrakById,
  createKontrak,
  updateKontrak,
  deleteKontrak,
} from '../controllers/prsKontrakController';
import { clerkAuthMiddleware } from '../middlewares/clerkAuth';

export const registerPrsKontrakRoutes = (app: OpenAPIHono) => {
  app.use('*', clerkAuthMiddleware);
  const basePath = '/personalia/kontrak';

  const KontrakSchema = z.object({
    id: z.number().openapi({ example: 1 }),
    kode_kontrak: z.string().openapi({ example: 'KT001' }),
    nama_kontrak: z.string().openapi({ example: 'Kontrak Kerja Tetap' }),
    created_at: z.string().datetime().optional(),
    updated_at: z.string().datetime().optional(),
  });

  const CreateKontrakSchema = KontrakSchema.omit({
    id: true,
    created_at: true,
    updated_at: true,
  });

  const KontrakArraySchema = z.array(KontrakSchema);

  // GET ALL
  app.openapi(
    createRoute({
      method: 'get',
      path: `${basePath}`,
      summary: 'Get all Kontrak',
      tags: ['Kontrak'],
      responses: {
        200: {
          description: 'Berhasil mengambil semua kontrak',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean(),
                message: z.string(),
                data: KontrakArraySchema,
              }),
            },
          },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    getAllKontrak
  );

  // GET BY ID
  app.openapi(
    createRoute({
      method: 'get',
      path: `${basePath}/{id}`,
      summary: 'Get Kontrak By ID',
      tags: ['Kontrak'],
      request: {
        params: z.object({ id: z.string().openapi({ example: '1' }) }),
      },
      responses: {
        200: {
          description: 'Berhasil mendapatkan kontrak',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean(),
                message: z.string(),
                data: KontrakSchema,
              }),
            },
          },
        },
        404: {
          description: 'Kontrak tidak ditemukan',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean(),
                message: z.string(),
                data: z.null(),
              }),
            },
          },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    getKontrakById
  );

  // CREATE
  app.openapi(
    createRoute({
      method: 'post',
      path: `${basePath}`,
      summary: 'Create Kontrak',
      tags: ['Kontrak'],
      request: {
        body: {
          content: { 'application/json': { schema: CreateKontrakSchema } },
        },
      },
      responses: {
        201: {
          description: 'Kontrak berhasil dibuat',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean(),
                message: z.string(),
                data: KontrakSchema,
              }),
            },
          },
        },
        400: { description: 'Validasi gagal' },
        401: { description: 'Unauthorized' },
      },
    }),
    createKontrak
  );

  // UPDATE
  app.openapi(
    createRoute({
      method: 'put',
      path: `${basePath}/{id}`,
      summary: 'Update Kontrak',
      tags: ['Kontrak'],
      request: {
        params: z.object({ id: z.string().openapi({ example: '1' }) }),
        body: {
          content: { 'application/json': { schema: CreateKontrakSchema } },
        },
      },
      responses: {
        200: {
          description: 'Kontrak berhasil diperbarui',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean(),
                message: z.string(),
                data: KontrakSchema,
              }),
            },
          },
        },
        404: { description: 'Kontrak tidak ditemukan' },
        401: { description: 'Unauthorized' },
      },
    }),
    updateKontrak
  );

  // DELETE
  app.openapi(
    createRoute({
      method: 'delete',
      path: `${basePath}/{id}`,
      summary: 'Delete Kontrak',
      tags: ['Kontrak'],
      request: {
        params: z.object({ id: z.string().openapi({ example: '1' }) }),
      },
      responses: {
        200: { description: 'Kontrak berhasil dihapus' },
        404: { description: 'Kontrak tidak ditemukan' },
        401: { description: 'Unauthorized' },
      },
    }),
    deleteKontrak
  );
};

export default registerPrsKontrakRoutes;
