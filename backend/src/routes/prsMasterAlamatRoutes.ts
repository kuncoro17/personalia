// import { Hono } from 'hono';
// import * as controller from '../controllers/prsMasterAlamatController';

// import { clerkAuthMiddleware } from '../middlewares/clerkAuth';
// const app = new Hono();
// app.use('*', clerkAuthMiddleware);

// const router = new Hono();
// router.get('/', clerkAuthMiddleware, controller.getAll);
// router.get('/:id', clerkAuthMiddleware, controller.getById);
// router.post('/create', clerkAuthMiddleware, controller.create);
// router.put('/:id', clerkAuthMiddleware, controller.update);
// router.delete('/:id', clerkAuthMiddleware, controller.remove);

// export default router;

import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { z } from 'zod';
import * as controller from '../controllers/prsMasterAlamatController';
import { clerkAuthMiddleware } from '../middlewares/clerkAuth';

export const PrsMasterAlamatroutes = (app: OpenAPIHono) => {
  app.use('*', clerkAuthMiddleware);
  const basePath = '/master-alamat';

  // ==============================
  // Schema Data
  // ==============================
  const alamatSchema = z.object({
    id: z.string().uuid(),
    provinsi: z.string(),
    kota: z.string(),
    kecamatan: z.string(),
    kelurahan: z.string(),
    kode_pos: z.string(),
  });

  const createAlamatSchema = alamatSchema.omit({ id: true });
  const updateAlamatSchema = createAlamatSchema.partial();

  const responseSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    data: z.any().nullable(),
  });

  // =====================================================
  // GET ALL
  // =====================================================
  app.openapi(
    createRoute({
      method: 'get',
      path: `${basePath}`,
      summary: 'Get all alamat',
      tags: ['Master Alamat'],
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Berhasil mengambil semua alamat',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean(),
                message: z.string().default('Berhasil mengambil data'),
                data: z.array(alamatSchema),
              }),
            },
          },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    controller.getAll
  );

  // =====================================================
  // GET BY ID
  // =====================================================
  app.openapi(
    createRoute({
      method: 'get',
      path: `${basePath}/{id}`,
      summary: 'Get alamat by ID',
      tags: ['Master Alamat'],
      security: [{ bearerAuth: [] }],
      request: {
        params: z.object({ id: z.string().uuid() }),
      },
      responses: {
        200: {
          description: 'Berhasil mengambil alamat',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean(),
                message: z.string().default('Berhasil mengambil data'),
                data: alamatSchema,
              }),
            },
          },
        },
        404: {
          description: 'Alamat tidak ditemukan',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean(),
                message: z.string().default('Data tidak ditemukan'),
                data: z.null(),
              }),
            },
          },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    controller.getById
  );

  // =====================================================
  // CREATE
  // =====================================================
  app.openapi(
    createRoute({
      method: 'post',
      path: `${basePath}/create`,
      summary: 'Create new alamat',
      tags: ['Master Alamat'],
      security: [{ bearerAuth: [] }],
      request: {
        body: {
          content: { 'application/json': { schema: createAlamatSchema } },
        },
      },
      responses: {
        201: {
          description: 'Alamat berhasil dibuat',
          content: {
            'application/json': {
              schema: responseSchema,
            },
          },
        },
        400: { description: 'Validasi gagal' },
        401: { description: 'Unauthorized' },
      },
    }),
    controller.create
  );

  // =====================================================
  // UPDATE
  // =====================================================
  app.openapi(
    createRoute({
      method: 'put',
      path: `${basePath}/{id}`,
      summary: 'Update alamat',
      tags: ['Master Alamat'],
      security: [{ bearerAuth: [] }],
      request: {
        params: z.object({ id: z.string().uuid() }),
        body: {
          content: { 'application/json': { schema: updateAlamatSchema } },
        },
      },
      responses: {
        200: {
          description: 'Alamat berhasil diperbarui',
          content: {
            'application/json': {
              schema: responseSchema,
            },
          },
        },
        404: {
          description: 'Alamat tidak ditemukan',
          content: {
            'application/json': {
              schema: responseSchema,
            },
          },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    controller.update
  );

  // =====================================================
  // DELETE
  // =====================================================
  app.openapi(
    createRoute({
      method: 'delete',
      path: `${basePath}/{id}`,
      summary: 'Delete alamat',
      tags: ['Master Alamat'],
      security: [{ bearerAuth: [] }],
      request: {
        params: z.object({ id: z.string().uuid() }),
      },
      responses: {
        200: {
          description: 'Alamat berhasil diperbarui',
          content: {
            'application/json': {
              schema: responseSchema,
            },
          },
        },
        404: {
          description: 'Alamat tidak ditemukan',
          content: {
            'application/json': {
              schema: responseSchema,
            },
          },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    controller.remove
  );
};

export default PrsMasterAlamatroutes;
