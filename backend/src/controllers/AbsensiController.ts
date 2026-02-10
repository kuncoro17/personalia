// import { Context } from 'hono';
// import { AbsensiService } from '../services/AbsensiService';
// import { logInfo } from '../utils/log.helper';

// export class AbsensiController {
//   constructor(private readonly service: AbsensiService) {}

//   getPivot = async (c: Context) => {
//     try {
//       const { start, end } = c.req.query();

//       logInfo(`AbsensiController.getPivot request: start=${start}, end=${end}`);

//       if (!start || !end) {
//         logInfo('AbsensiController.getPivot gagal: start atau end kosong');
//         return c.json({ message: 'start and end query required' }, 400);
//       }

//       const data = await this.service.getPivot(start, end);

//       logInfo(`AbsensiController.getPivot success, total rows: ${data.length}`);

//       return c.json({
//         success: true,
//         data,
//       });
//     } catch (err) {
//       const message =
//         err instanceof Error ? err.message : 'Terjadi kesalahan pada server';

//       logInfo(`AbsensiController.getPivot error: ${message}`);

//       return c.json(
//         {
//           success: false,
//           message,
//         },
//         500
//       );
//     }
//   };
// }
