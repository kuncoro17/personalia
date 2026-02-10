// import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
// import { z } from 'zod';
// import { clerkAuthMiddleware } from '../middlewares/clerkAuth';
// import { getLatestCheckInOut } from '../controllers/SdmCheckinoutController';

// export const sdmCheckInOutRoutes = (app: OpenAPIHono) => {
//   // 🔐 Protect all routes
//   app.use('*', clerkAuthMiddleware);

//   app.openapi(
//     createRoute({
//       method: 'get',
//       path: '/personalia/checkinout/latest',
//       summary: 'Get latest check-in/out by userid',
//       description: 'Mengambil 14 data check-in/out terbaru berdasarkan userid',
//       tags: ['Absensi'],
//       security: [
//         {
//           bearerAuth: [],
//         },
//       ],
//       request: {
//         query: z.object({
//           userid: z.string().min(1).openapi({
//             example: '0122024',
//           }),
//         }),
//       },
//       responses: {
//         200: {
//           description: 'Berhasil mengambil data check-in/out',
//           content: {
//             'application/json': {
//               schema: z.object({
//                 success: z.boolean(),
//                 message: z.string(),
//                 data: z.array(
//                   z.object({
//                     id: z.number(),
//                     userid: z.string(),
//                     checktime: z.string().datetime(),
//                     checktype: z.string().nullable(),
//                     employeename: z.string().nullable(),
//                     nik: z.string().nullable(),
//                     deptname: z.string().nullable(),
//                     machine: z.string().nullable(),
//                   })
//                 ),
//               }),
//             },
//           },
//         },
//         400: {
//           description: 'Bad Request',
//         },
//         401: {
//           description: 'Unauthorized',
//         },
//       },
//     }),
//     getLatestCheckInOut
//   );
// };

// export default sdmCheckInOutRoutes;
