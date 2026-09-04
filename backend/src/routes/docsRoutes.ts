import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { z } from 'zod';
import * as controller from '../controllers/DocsController';
import { clerkAuthMiddleware } from '../middlewares/clerkAuth';

export const docRoutes = (app: OpenAPIHono) => {
  app.use('*', clerkAuthMiddleware);

  const dokumenSchema = z
    .object({
      id: z.string().uuid(),
      karyawan_id: z.string().uuid(),
      tipe_dokumen_id: z.string().uuid(),
      dokumen_path: z.string().nullable(),
      tipe_dokumen: z
        .object({
          id: z.string().uuid(),
          tipe_dokumen: z.string(),
        })
        .nullable()
        .optional(),
      created_at: z.string().nullable(),
      updated_at: z.string().nullable(),
    })
    .openapi('Dokumen');

  // GET semua dokumen
  app.openapi(
    createRoute({
      method: 'get',
      path: '/personalia/docs',
      summary: 'Get all documents',
      description: 'Mengambil semua dokumen',
      tags: ['Dokumen'],
      responses: {
        200: {
          description: 'Daftar dokumen',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean(),
                message: z.string(),
                data: z.array(dokumenSchema),
              }),
            },
          },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    controller.getAll
  );

  app.openapi(
    createRoute({
      method: 'get',
      path: '/personalia/docs/karyawan/{karyawanId}',
      summary: 'Get documents by employee ID',
      description: 'Mengambil semua dokumen milik satu karyawan',
      tags: ['Dokumen'],
      request: {
        params: z.object({ karyawanId: z.string().uuid() }),
      },
      responses: {
        200: {
          description: 'Daftar dokumen karyawan',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean(),
                message: z.string(),
                data: z.array(dokumenSchema),
              }),
            },
          },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    controller.getDokumenByKaryawan
  );

  // GET dokumen by ID
  app.openapi(
    createRoute({
      method: 'get',
      path: '/personalia/docs/{id}',
      summary: 'Get document by ID',
      description: 'Mengambil dokumen berdasarkan ID',
      tags: ['Dokumen'],
      request: {
        params: z.object({ id: z.string().uuid() }).openapi('DokumenID'),
      },
      responses: {
        200: {
          description: 'Dokumen ditemukan',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean(),
                message: z.string(),
                data: dokumenSchema,
              }),
            },
          },
        },
        404: { description: 'Dokumen tidak ditemukan' },
        401: { description: 'Unauthorized' },
      },
    }),
    controller.getDokumen
  );

  // CREATE dokumen (upload)
  app.openapi(
    createRoute({
      method: 'post',
      path: '/personalia/docs/upload',
      summary: 'Create document',
      description: 'Upload dokumen baru',
      tags: ['Dokumen'],
      request: {
        body: {
          content: {
            'multipart/form-data': {
              schema: z
                .object({
                  karyawan_id: z.string().uuid(),
                  tipe_dokumen_id: z.string().uuid().optional(),
                  dokumen: z
                    .any()
                    .openapi({ type: 'string', format: 'binary' }),
                })
                .openapi('UploadDokumenBody'),
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Dokumen berhasil dibuat',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean(),
                message: z.string(),
                data: dokumenSchema,
              }),
            },
          },
        },
        400: { description: 'Validasi gagal' },
        401: { description: 'Unauthorized' },
      },
    }),
    controller.createDokumen
  );

  // UPDATE dokumen by ID (upload)
  app.openapi(
    createRoute({
      method: 'put',
      path: '/personalia/docs/upload/{id}',
      summary: 'Update document',
      description: 'Update dokumen berdasarkan ID',
      tags: ['Dokumen'],
      request: {
        params: z.object({ id: z.string().uuid() }).openapi('DokumenID'),
        body: {
          content: {
            'multipart/form-data': {
              schema: z
                .object({
                  karyawan_id: z.string().uuid().optional(),
                  tipe_dokumen_id: z.string().uuid().optional(),
                  dokumen: z
                    .any()
                    .optional()
                    .openapi({ type: 'string', format: 'binary' }),
                })
                .openapi('UpdateDokumenBody'),
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Dokumen berhasil diupdate',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean(),
                message: z.string(),
                data: dokumenSchema,
              }),
            },
          },
        },
        404: { description: 'Dokumen tidak ditemukan' },
        401: { description: 'Unauthorized' },
      },
    }),
    controller.updateDokumen
  );

  // DELETE dokumen by ID
  app.openapi(
    createRoute({
      method: 'delete',
      path: '/personalia/docs/{id}',
      summary: 'Delete document',
      description: 'Menghapus dokumen berdasarkan ID',
      tags: ['Dokumen'],
      request: {
        params: z.object({ id: z.string().uuid() }).openapi('DokumenID'),
      },
      responses: {
        200: {
          description: 'Dokumen berhasil dihapus',
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
        404: { description: 'Dokumen tidak ditemukan' },
        401: { description: 'Unauthorized' },
      },
    }),
    controller.deleteDokumen
  );
};
