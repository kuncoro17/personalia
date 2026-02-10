// import { Hono } from 'hono';
// import PrsKontakDaruratController from '../controllers/prsKontakDaruratController';

// import { clerkAuthMiddleware } from '../middlewares/clerkAuth';
// const app = new Hono();
// app.use('*', clerkAuthMiddleware);

// const router = new Hono();

// router.get(
//   '/',
//   clerkAuthMiddleware,
//   PrsKontakDaruratController.getAllKontakDarurat
// );
// router.get(
//   '/by-id/:id',
//   clerkAuthMiddleware,
//   PrsKontakDaruratController.getKontakDaruratById
// );
// router.post(
//   '/create',
//   clerkAuthMiddleware,
//   PrsKontakDaruratController.createKontakDarurat
// );
// router.put(
//   '/update/:id',
//   clerkAuthMiddleware,
//   PrsKontakDaruratController.updateKontakDarurat
// );
// router.delete(
//   '/delete/:id',
//   clerkAuthMiddleware,
//   PrsKontakDaruratController.deleteKontakDarurat
// );

// export default router;

import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { z } from 'zod';
import PrsKontakDaruratController from '../controllers/prsKontakDaruratController';
import { clerkAuthMiddleware } from '../middlewares/clerkAuth';

export const prsKontakDaruratRoutes = (app: OpenAPIHono) => {
  app.use('*', clerkAuthMiddleware);

  // =======================
  // SCHEMA DEFINITIONS
  // =======================
  const kontakDaruratSchema = z
    .object({
      id: z.string().uuid().optional(),
      karyawan_id: z.string().uuid(),
      nama_kontak: z.string(),
      hubungan: z.string(),
      nomor_telepon: z.string(),
    })
    .openapi('KontakDarurat');

  const kontakDaruratBodySchema = kontakDaruratSchema.omit({ id: true });

  const kontakDaruratArraySchema = z
    .array(kontakDaruratSchema)
    .openapi('KontakDaruratArray');

  // =======================
  // ROUTES
  // =======================

  // GET All
  app.openapi(
    createRoute({
      method: 'get',
      path: '/personalia/kontak-darurat',
      summary: 'Get all kontak darurat',
      tags: ['Kontak Darurat'],
      responses: {
        200: {
          description: 'Berhasil mengambil semua kontak darurat',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean(),
                message: z.string(),
                data: kontakDaruratArraySchema,
              }),
            },
          },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    PrsKontakDaruratController.getAllKontakDarurat
  );

  // GET By ID
  app.openapi(
    createRoute({
      method: 'get',
      path: '/personalia/kontak-darurat/by-id/{id}',
      summary: 'Get kontak darurat by ID',
      tags: ['Kontak Darurat'],
      request: {
        params: z.object({ id: z.string().uuid() }).openapi('KontakDaruratID'),
      },
      responses: {
        200: {
          description: 'Berhasil mengambil kontak darurat',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean(),
                message: z.string(),
                data: kontakDaruratSchema,
              }),
            },
          },
        },
        404: { description: 'Kontak darurat tidak ditemukan' },
        401: { description: 'Unauthorized' },
      },
    }),
    PrsKontakDaruratController.getKontakDaruratById
  );

  // POST Create
  app.openapi(
    createRoute({
      method: 'post',
      path: '/personalia/kontak-darurat/create',
      summary: 'Create kontak darurat',
      tags: ['Kontak Darurat'],
      request: {
        body: {
          content: { 'application/json': { schema: kontakDaruratBodySchema } },
        },
      },
      responses: {
        201: {
          description: 'Kontak darurat berhasil dibuat',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean(),
                message: z.string(),
                data: kontakDaruratSchema,
              }),
            },
          },
        },
        400: { description: 'Validasi gagal' },
        401: { description: 'Unauthorized' },
      },
    }),
    PrsKontakDaruratController.createKontakDarurat
  );

  // PUT Update
  app.openapi(
    createRoute({
      method: 'put',
      path: '/personalia/kontak-darurat/update/{id}',
      summary: 'Update kontak darurat',
      tags: ['Kontak Darurat'],
      request: {
        params: z.object({ id: z.string().uuid() }).openapi('KontakDaruratID'),
        body: {
          content: { 'application/json': { schema: kontakDaruratBodySchema } },
        },
      },
      responses: {
        200: {
          description: 'Kontak darurat berhasil diperbarui',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean(),
                message: z.string(),
                data: kontakDaruratSchema,
              }),
            },
          },
        },
        404: { description: 'Kontak darurat tidak ditemukan' },
        401: { description: 'Unauthorized' },
      },
    }),
    PrsKontakDaruratController.updateKontakDarurat
  );

  // DELETE
  app.openapi(
    createRoute({
      method: 'delete',
      path: '/personalia/kontak-darurat/delete/{id}',
      summary: 'Delete kontak darurat',
      tags: ['Kontak Darurat'],
      request: {
        params: z.object({ id: z.string().uuid() }).openapi('KontakDaruratID'),
      },
      responses: {
        200: { description: 'Kontak darurat berhasil dihapus' },
        404: { description: 'Kontak darurat tidak ditemukan' },
        401: { description: 'Unauthorized' },
      },
    }),
    PrsKontakDaruratController.deleteKontakDarurat
  );
};

export default prsKontakDaruratRoutes;
