import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { z } from 'zod';
import * as controller from '../controllers/prsBagianController';
import { clerkAuthMiddleware } from '../middlewares/clerkAuth';

export const bagianRoutes = (app: OpenAPIHono) => {
  app.use('*', clerkAuthMiddleware);

  /* =======================
   * ROUTES
   * ======================= */

  // GET ALL
  app.openapi(
    createRoute({
      method: 'get',
      path: '/personalia/bagian',
      summary: 'Get all Bagian',
      description: 'Mengambil seluruh data bagian',
      tags: ['Bagian'],
      security: [
        {
          bearerAuth: [],
        },
      ],
      responses: {
        200: {
          description: 'Daftar Bagian',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean(),
                message: z.string(),
                data: z.array(
                  z.object({
                    id: z.string().uuid(),
                    namaBagian: z.string(),
                    kodeDivisi: z.string(),
                  })
                ),
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
      path: '/personalia/bagian/{id}',
      summary: 'Get Bagian by ID',
      description: 'Mengambil data bagian berdasarkan ID',
      tags: ['Bagian'],
      request: {
        params: z.object({ id: z.string().uuid() }),
      },
      responses: {
        200: {
          description: 'Bagian ditemukan',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean(),
                message: z.string(),
                data: z.object({
                  id: z.string().uuid(),
                  namaBagian: z.string(),
                  kodeDivisi: z.string(),
                }),
              }),
            },
          },
        },
        404: { description: 'Bagian tidak ditemukan' },
        401: { description: 'Unauthorized' },
      },
    }),
    controller.getById
  );

  // CREATE
  app.openapi(
    createRoute({
      method: 'post',
      path: '/personalia/bagian',
      summary: 'Create Bagian',
      description: 'Menambahkan data bagian baru',
      tags: ['Bagian'],
      request: {
        body: {
          content: {
            'application/json': {
              schema: z.object({
                nama_bag: z.string(),
                kode: z.string(),
              }),
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Bagian berhasil dibuat',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean(),
                message: z.string(),
                data: z.any(),
              }),
            },
          },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    controller.create
  );

  // UPDATE
  app.openapi(
    createRoute({
      method: 'put',
      path: '/personalia/bagian/{id}',
      summary: 'Update Bagian',
      description: 'Mengupdate data bagian',
      tags: ['Bagian'],
      request: {
        params: z.object({ id: z.string().uuid() }),
        body: {
          content: {
            'application/json': {
              schema: z.object({
                nama_bag: z.string(),
                kode: z.string(),
              }),
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Bagian berhasil diupdate',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean(),
                message: z.string(),
                data: z.any(),
              }),
            },
          },
        },
        404: { description: 'Bagian tidak ditemukan' },
        401: { description: 'Unauthorized' },
      },
    }),
    controller.update
  );

  // DELETE
  app.openapi(
    createRoute({
      method: 'delete',
      path: '/personalia/bagian/{id}',
      summary: 'Delete Bagian',
      description: 'Menghapus data bagian',
      tags: ['Bagian'],
      request: {
        params: z.object({ id: z.string().uuid() }),
      },
      responses: {
        200: {
          description: 'Bagian berhasil dihapus',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean(),
                message: z.string(),
                data: z.any(),
              }),
            },
          },
        },
        404: { description: 'Bagian tidak ditemukan' },
        401: { description: 'Unauthorized' },
      },
    }),
    controller.remove
  );
};

export default bagianRoutes;
