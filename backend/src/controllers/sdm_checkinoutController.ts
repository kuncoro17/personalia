// import { Context } from 'hono';
// import { AbsensiService } from '../services/Sdm_checkinoutSerivces';

// const service = new AbsensiService();

// interface GabunganQuery {
//   start: string;
//   end: string;
// }

// export class AbsensiController {
//   static async getGabungan(c: Context) {
//     try {
//       const query = c.req.query() as unknown as GabunganQuery;
//       const { start, end } = query;

//       if (!start || !end) {
//         return c.json({ error: 'start dan end wajib ada' }, 400);
//       }

//       const data = await service.getGabungan(start, end);
//       return c.json(data, 200);
//     } catch (err: unknown) {
//       if (err instanceof Error) {
//         return c.json({ error: err.message }, 500);
//       }
//       return c.json({ error: 'Unexpected error' }, 500);
//     }
//   }
// }
