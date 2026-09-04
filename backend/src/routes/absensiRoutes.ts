// // // routes/absensiRoutes.ts
// // import { Hono } from 'hono';
// // import { AbsensiController } from '../controllers/AbsensiController';
// // import { AbsensiService } from '../services/AbsensiService';
// // import { AbsensiRepository } from '../repositories/AbsensiRepository';
// // import { clerkAuthMiddleware } from '../middlewares/clerkAuth';
// // const repo = new AbsensiRepository();
// // const service = new AbsensiService(repo);
// // const controller = new AbsensiController(service);

// // const app = new Hono();
// // app.use('*', clerkAuthMiddleware);

// // const absensiRoutes = new Hono();

// // absensiRoutes.get('/pivot', clerkAuthMiddleware, controller.getPivot);

// // export default absensiRoutes;

// // routes/absensiRoutes.ts
// import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
// import { z } from 'zod';
// import { AbsensiController } from '../controllers/AbsensiController';
// import { AbsensiService } from '../services/AbsensiService';
// import { AbsensiRepository } from '../repositories/AbsensiRepository';
// import { clerkAuthMiddleware } from '../middlewares/clerkAuth';

// export const absensiRoutes = (app: OpenAPIHono) => {
//   app.use('*', clerkAuthMiddleware);
//   // --- INSTANCE SERVICE & CONTROLLER ---
//   const repo = new AbsensiRepository();
//   const service = new AbsensiService(repo);
//   const controller = new AbsensiController(service);

//   // --- Schema ---
//   const pivotResponseSchema = z
//     .object({
//       success: z.boolean(),
//       message: z.string(),
//       data: z.array(
//         z.object({
//           id: z.number(),
//           namaBagian: z.string(),
//         })
//       ),
//     })
//     .openapi('PivotResponse');

//   // --- Route ---
//   app.openapi(
//     createRoute({
//       method: 'get',
//       path: '/personalia/pivot',
//       summary: 'Get pivot data for Absensi',
//       description: 'Mengambil data pivot Absensi',
//       tags: ['Absensi'],
//       request: {
//         query: z.object({
//           start: z.string().openapi({ example: '2024-01-01' }),
//           end: z.string().openapi({ example: '2024-01-31' }),
//         }),
//       },
//       responses: {
//         200: {
//           description: 'Berhasil mengambil pivot',
//           content: { 'application/json': { schema: pivotResponseSchema } },
//         },
//       },
//     }),

//     // --- HANDLER YANG BENAR ---
//     async c => {
//       await clerkAuthMiddleware(c, async () => {});
//       return controller.getPivot(c); // <-- INI YANG BENAR
//     }
//   );
// };
