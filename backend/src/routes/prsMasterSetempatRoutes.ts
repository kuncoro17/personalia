import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { z } from 'zod';
import { clerkAuthMiddleware } from '../middlewares/clerkAuth';
import {
  createSetempat,
  deleteSetempat,
  getAllSetempat,
  getSetempatById,
  updateSetempat,
} from '../controllers/prsMasterSetempatController';

export const prsMasterSetempatRoutes = (app: OpenAPIHono) => {
  app.use('*', clerkAuthMiddleware);
  const basePath = '/master-setempat';
  const router = new OpenAPIHono();

  const SetempatSchema = z.object({
    id: z.number(),
    kota_setempat: z.string(),
  });

  const CreateSchema = SetempatSchema.omit({ id: true });
  const UpdateSchema = CreateSchema.partial();

  const ResponseListSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    data: z.array(SetempatSchema),
  });

  const ResponseSingleSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    data: SetempatSchema.nullable(),
  });

  router.openapi(
    createRoute({
      method: 'get',
      path: '/',
      summary: 'Get all setempat',
      tags: ['Setempat'],
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Berhasil mengambil semua setempat',
          content: { 'application/json': { schema: ResponseListSchema } },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    getAllSetempat
  );

  router.openapi(
    createRoute({
      method: 'get',
      path: '/{id}',
      summary: 'Get setempat by ID',
      tags: ['Setempat'],
      security: [{ bearerAuth: [] }],
      request: { params: z.object({ id: z.string().regex(/^[0-9]+$/) }) },
      responses: {
        200: {
          description: 'Berhasil mengambil setempat',
          content: { 'application/json': { schema: ResponseSingleSchema } },
        },
        404: {
          description: 'Setempat tidak ditemukan',
          content: { 'application/json': { schema: ResponseSingleSchema } },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    getSetempatById
  );

  router.openapi(
    createRoute({
      method: 'post',
      path: '/',
      summary: 'Create new setempat',
      tags: ['Setempat'],
      security: [{ bearerAuth: [] }],
      request: {
        body: { content: { 'application/json': { schema: CreateSchema } } },
      },
      responses: {
        201: {
          description: 'Setempat berhasil dibuat',
          content: { 'application/json': { schema: ResponseSingleSchema } },
        },
        400: {
          description: 'Validasi gagal',
          content: { 'application/json': { schema: ResponseSingleSchema } },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    createSetempat
  );

  router.openapi(
    createRoute({
      method: 'put',
      path: '/{id}',
      summary: 'Update setempat',
      tags: ['Setempat'],
      security: [{ bearerAuth: [] }],
      request: {
        params: z.object({ id: z.string().regex(/^[0-9]+$/) }),
        body: { content: { 'application/json': { schema: UpdateSchema } } },
      },
      responses: {
        200: {
          description: 'Setempat berhasil diperbarui',
          content: { 'application/json': { schema: ResponseSingleSchema } },
        },
        404: {
          description: 'Setempat tidak ditemukan',
          content: { 'application/json': { schema: ResponseSingleSchema } },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    updateSetempat
  );

  router.openapi(
    createRoute({
      method: 'delete',
      path: '/{id}',
      summary: 'Delete setempat',
      tags: ['Setempat'],
      security: [{ bearerAuth: [] }],
      request: { params: z.object({ id: z.string().regex(/^[0-9]+$/) }) },
      responses: {
        200: {
          description: 'Setempat berhasil dihapus',
          content: { 'application/json': { schema: ResponseSingleSchema } },
        },
        404: {
          description: 'Setempat tidak ditemukan',
          content: { 'application/json': { schema: ResponseSingleSchema } },
        },
        401: { description: 'Unauthorized' },
      },
    }),
    deleteSetempat
  );

  app.route(basePath, router);
};

export default prsMasterSetempatRoutes;
