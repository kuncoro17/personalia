import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { z } from 'zod';
import * as controller from '../controllers/HistoryController';
import { clerkAuthMiddleware } from '../middlewares/clerkAuth';

export const historyRoutes = (app: OpenAPIHono) => {
  app.use('*', clerkAuthMiddleware);

  const historySchema = z
    .object({
      id_karyawan: z.string().uuid(),
      tipe_perubahan: z.string(),
      value_lama: z.string().nullable(),
      created_at: z.string().optional(),
      updated_at: z.string().optional(),
    })
    .openapi('History');

  // LIST
  app.openapi(
    createRoute({
      method: 'get',
      path: '/history2',
      summary: 'Ambil semua history perubahan',
      tags: ['History2'],
      responses: {
        200: {
          description: 'Berhasil mengambil list history',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean(),
                message: z.string(),
                data: z.array(historySchema),
              }),
            },
          },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    controller.getAllHistory
  );

  // GET BY ID
  app.openapi(
    createRoute({
      method: 'get',
      path: '/history2/{id}',
      summary: 'Ambil history berdasarkan ID karyawan',
      tags: ['History2'],
      request: {
        params: z.object({
          id: z.string().uuid().openapi({
            example: 'f2f125ad-a8df-4b0b-9fa1-1d26be123999',
          }),
        }),
      },
      responses: {
        200: {
          description: 'Berhasil mengambil history',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean(),
                message: z.string(),
                data: historySchema.nullable(),
              }),
            },
          },
        },
        404: { description: 'History tidak ditemukan' },
        401: { description: 'Unauthorized' },
      },
    }),
    controller.getHistoryById
  );

  // CREATE
  app.openapi(
    createRoute({
      method: 'post',
      path: '/history2',
      summary: 'Buat data history baru',
      tags: ['History2'],
      request: {
        body: {
          content: {
            'application/json': {
              schema: historySchema.omit({
                created_at: true,
                updated_at: true,
              }),
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Berhasil membuat history baru',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean(),
                message: z.string(),
                data: historySchema,
              }),
            },
          },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    controller.createHistory
  );

  // UPDATE
  app.openapi(
    createRoute({
      method: 'put',
      path: '/history2/{id}',
      summary: 'Update history berdasarkan ID karyawan',
      tags: ['History2'],
      request: {
        params: z.object({ id: z.string().uuid() }),
        body: {
          content: {
            'application/json': {
              schema: historySchema
                .partial()
                .omit({ created_at: true, updated_at: true }),
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Berhasil update history',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean(),
                message: z.string(),
                data: historySchema,
              }),
            },
          },
        },
        404: { description: 'History tidak ditemukan' },
        401: { description: 'Unauthorized' },
      },
    }),
    controller.updateHistory
  );

  // DELETE
  app.openapi(
    createRoute({
      method: 'delete',
      path: '/history2/{id}',
      summary: 'Hapus history berdasarkan ID karyawan',
      tags: ['History2'],
      request: {
        params: z.object({ id: z.string().uuid() }),
      },
      responses: {
        200: {
          description: 'Berhasil hapus history',
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
        404: { description: 'History tidak ditemukan' },
        401: { description: 'Unauthorized' },
      },
    }),
    controller.deleteHistory
  );
};

export default historyRoutes;
