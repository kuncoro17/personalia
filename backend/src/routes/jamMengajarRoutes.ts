import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { z } from 'zod';
import * as controller from '../controllers/prsJamMengajarKaryawanController';
import { clerkAuthMiddleware } from '../middlewares/clerkAuth';

export const jamMengajarRoutes = (app: OpenAPIHono) => {
  // ===============================
  app.use('*', clerkAuthMiddleware);

  // ===============================
  // SCHEMA DEFINITIONS
  // ===============================
  const jamMengajarSchema = z
    .object({
      id_karyawan: z.string().uuid(),
      ukk_id: z.string().uuid(),
      jam_mengajar: z.number(),
      created_at: z.string().optional(),
      updated_at: z.string().optional(),
    })
    .openapi('JamMengajar');

  const jamMengajarBodySchema = z
    .object({
      id_karyawan: z.string().uuid(),
      ukk_id: z.string().uuid(),
      jam_mengajar: z.number(),
    })
    .openapi('JamMengajarBody');

  // ===============================
  // ROUTES
  // ===============================

  // GET ALL
  app.openapi(
    createRoute({
      method: 'get',
      path: '/personalia/jam_mengajar',
      summary: 'Get all jam mengajar',
      tags: ['JamMengajar'],
      responses: {
        200: {
          description: 'List jam mengajar',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean(),
                message: z.string(),
                data: z.array(jamMengajarSchema),
              }),
            },
          },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    controller.getAll
  );

  // GET by ID
  app.openapi(
    createRoute({
      method: 'get',
      path: '/personalia/jam_mengajar/{id}',
      summary: 'Get jam mengajar by ID',
      tags: ['JamMengajar'],
      request: {
        params: z.object({ id: z.string().uuid() }),
      },
      responses: {
        200: {
          description: 'Jam mengajar ditemukan',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean(),
                message: z.string(),
                data: jamMengajarSchema,
              }),
            },
          },
        },
        404: { description: 'Tidak ditemukan' },
        401: { description: 'Unauthorized' },
      },
    }),
    controller.getById
  );

  // GET by id_karyawan
  app.openapi(
    createRoute({
      method: 'get',
      path: '/personalia/jam_mengajar/karyawan/{id_karyawan}',
      summary: 'Get jam mengajar by ID karyawan',
      tags: ['JamMengajar'],
      request: {
        params: z.object({ id_karyawan: z.string().uuid() }),
      },
      responses: {
        200: {
          description: 'Data jam mengajar',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean(),
                message: z.string(),
                data: z.array(jamMengajarSchema),
              }),
            },
          },
        },
        404: { description: 'Tidak ditemukan' },
        401: { description: 'Unauthorized' },
      },
    }),
    controller.getByKaryawanId
  );

  // CREATE
  app.openapi(
    createRoute({
      method: 'post',
      path: '/personalia/jam_mengajar',
      summary: 'Create jam mengajar',
      tags: ['JamMengajar'],
      request: {
        body: {
          content: { 'application/json': { schema: jamMengajarBodySchema } },
        },
      },
      responses: {
        201: {
          description: 'Jam mengajar dibuat',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean(),
                message: z.string(),
                data: jamMengajarSchema,
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

  // UPDATE by ID
  app.openapi(
    createRoute({
      method: 'put',
      path: '/personalia/jam_mengajar/{id}',
      summary: 'Update jam mengajar by ID',
      tags: ['JamMengajar'],
      request: {
        params: z.object({ id: z.string().uuid() }),
        body: {
          content: { 'application/json': { schema: jamMengajarBodySchema } },
        },
      },
      responses: {
        200: {
          description: 'Jam mengajar berhasil diupdate',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean(),
                message: z.string(),
                data: jamMengajarSchema,
              }),
            },
          },
        },
        404: { description: 'Tidak ditemukan' },
        401: { description: 'Unauthorized' },
      },
    }),
    controller.updateJamMengajar
  );

  // UPDATE by id_karyawan & ukk_id
  app.openapi(
    createRoute({
      method: 'put',
      path: '/personalia/jam_mengajar/update_mapel/{id_karyawan}/{ukk_id}',
      summary: 'Update jam mengajar by id_karyawan & ukk_id',
      tags: ['JamMengajar'],
      request: {
        params: z.object({
          id_karyawan: z.string().uuid(),
          ukk_id: z.string().uuid(),
        }),
        body: {
          content: {
            'application/json': {
              schema: z.object({
                jam_mengajar: z.number().optional().nullable(),
              }),
            },
          },
        },
      },
      responses: {
        200: { description: 'Jam mengajar berhasil diupdate' },
        404: { description: 'Tidak ditemukan' },
        401: { description: 'Unauthorized' },
      },
    }),
    controller.updateJamMengajarByIdKaryawanAndUkkId
  );

  // DELETE
  app.openapi(
    createRoute({
      method: 'delete',
      path: '/personalia/jam_mengajar/{id}',
      summary: 'Delete jam mengajar',
      tags: ['JamMengajar'],
      request: {
        params: z.object({ id: z.string().uuid() }),
      },
      responses: {
        200: { description: 'Berhasil dihapus' },
        404: { description: 'Tidak ditemukan' },
        401: { description: 'Unauthorized' },
      },
    }),
    controller.remove
  );
};

export default jamMengajarRoutes;
