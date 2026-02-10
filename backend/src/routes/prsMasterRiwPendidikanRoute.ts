// import { Hono } from 'hono';
// import controller from '../controllers/prsMasterRiwPendidikanController';

// const router = new Hono();

// import { clerkAuthMiddleware } from '../middlewares/clerkAuth';
// const app = new Hono();
// app.use('*', clerkAuthMiddleware);

// router.get('/', clerkAuthMiddleware, controller.getAll);
// router.get('/:id', clerkAuthMiddleware, controller.getById);
// router.post('/created', clerkAuthMiddleware, controller.create);
// router.put('/updated/:id', clerkAuthMiddleware, controller.update);
// router.delete('/deleted/:id', clerkAuthMiddleware, controller.remove);

// export default router;
import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { z } from 'zod';
import controller from '../controllers/prsMasterRiwPendidikanController';
import { clerkAuthMiddleware } from '../middlewares/clerkAuth';

export const prsMasterRiwPendidikanRoutes = (app: OpenAPIHono) => {
  app.use('*', clerkAuthMiddleware);
  const router = new OpenAPIHono();

  // ============================
  // 🔹 SCHEMAS
  // ============================
  const PendidikanSchema = z.object({
    id: z.number(),
    karyawan_id: z.string(),
    jenjang: z.string(),
    nama_sekolah: z.string(),
    jurusan: z.string().optional(),
    tahun_lulus: z.number().optional(),
  });

  const CreateSchema = PendidikanSchema.omit({ id: true });
  const UpdateSchema = CreateSchema.partial();

  const ResponseListSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    data: z.array(PendidikanSchema),
  });

  const ResponseSingleSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    data: PendidikanSchema.nullable(),
  });

  // ============================
  // 🔹 GET ALL
  // ============================
  router.openapi(
    createRoute({
      method: 'get',
      path: '/',
      summary: 'Get all riwayat pendidikan',
      tags: ['Riwayat Pendidikan'],
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'OK',
          content: { 'application/json': { schema: ResponseListSchema } },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    controller.getAll
  );

  // ============================
  // 🔹 GET BY ID
  // ============================
  router.openapi(
    createRoute({
      method: 'get',
      path: '/{id}',
      summary: 'Get riwayat pendidikan by ID',
      tags: ['Riwayat Pendidikan'],
      security: [{ bearerAuth: [] }],
      request: {
        params: z.object({ id: z.string().openapi({ example: '1' }) }),
      },
      responses: {
        200: {
          description: 'OK',
          content: { 'application/json': { schema: ResponseSingleSchema } },
        },
        404: {
          description: 'Riwayat pendidikan tidak ditemukan',
          content: { 'application/json': { schema: ResponseSingleSchema } },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    controller.getById
  );

  // ============================
  // 🔹 CREATE
  // ============================
  router.openapi(
    createRoute({
      method: 'post',
      path: '/',
      summary: 'Create new riwayat pendidikan',
      tags: ['Riwayat Pendidikan'],
      security: [{ bearerAuth: [] }],
      request: {
        body: { content: { 'application/json': { schema: CreateSchema } } },
      },
      responses: {
        201: {
          description: 'Created',
          content: { 'application/json': { schema: ResponseSingleSchema } },
        },
        400: {
          description: 'Validasi gagal',
          content: { 'application/json': { schema: ResponseSingleSchema } },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    controller.create
  );

  // ============================
  // 🔹 UPDATE
  // ============================
  router.openapi(
    createRoute({
      method: 'put',
      path: '/{id}',
      summary: 'Update riwayat pendidikan',
      tags: ['Riwayat Pendidikan'],
      security: [{ bearerAuth: [] }],
      request: {
        params: z.object({ id: z.string() }),
        body: { content: { 'application/json': { schema: UpdateSchema } } },
      },
      responses: {
        200: {
          description: 'Updated',
          content: { 'application/json': { schema: ResponseSingleSchema } },
        },
        404: {
          description: 'Riwayat pendidikan tidak ditemukan',
          content: { 'application/json': { schema: ResponseSingleSchema } },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    controller.update
  );

  // ============================
  // 🔹 DELETE
  // ============================
  router.openapi(
    createRoute({
      method: 'delete',
      path: '/{id}',
      summary: 'Delete riwayat pendidikan',
      tags: ['Riwayat Pendidikan'],
      security: [{ bearerAuth: [] }],
      request: { params: z.object({ id: z.string() }) },
      responses: {
        200: {
          description: 'Deleted',
          content: { 'application/json': { schema: ResponseSingleSchema } },
        },
        404: {
          description: 'Riwayat pendidikan tidak ditemukan',
          content: { 'application/json': { schema: ResponseSingleSchema } },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    controller.remove
  );

  // ============================
  // 🔹 REGISTER ROUTER
  // ============================
  app.route('/riwayat-pendidikan', router);
};

export default prsMasterRiwPendidikanRoutes;
