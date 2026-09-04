// import { LemburRepository } from '../repositories/lemburRepository';
// import { CheckinRepository } from '../repositories/checkinRepository';
// import { CheckinRow, LemburRow, GabunganRow } from '../types/AbsensiTypes';

// export class AbsensiService {
//   private lemburRepo = new LemburRepository();
//   private checkinRepo = new CheckinRepository();

//   async getGabungan(start: string, end: string): Promise<GabunganRow[]> {
//     const lemburData: LemburRow[] = await this.lemburRepo.getByRange(
//       start,
//       end
//     );
//     const checkinData: CheckinRow[] = await this.checkinRepo.getByRange(
//       start,
//       end
//     );

//     const mapCheckin: Record<string, string[]> = {};

//     checkinData.forEach(row => {
//       const userid = row.userid
//         ? row.userid.toString().padStart(7, '0')
//         : '0000000';

//       const tgl =
//         row.checktime instanceof Date
//           ? row.checktime.toISOString().slice(0, 10)
//           : new Date(row.checktime).toISOString().slice(0, 10);

//       const key = `${userid}#${tgl}`;
//       if (!mapCheckin[key]) mapCheckin[key] = [];

//       if (row.checktime) {
//         const tglString =
//           row.checktime instanceof Date
//             ? row.checktime.toISOString()
//             : new Date(row.checktime).toISOString();
//         mapCheckin[key].push(tglString);
//       }
//     });

//     return lemburData.map((row): GabunganRow => {
//       const nik = row.Nik ? row.Nik.toString().padStart(7, '0') : '0000000';

//       let tglFormat = '';
//       if (row.Tgl) {
//         const [d, m, y] = row.Tgl.split('/');
//         tglFormat = `${y}-${m}-${d}`;
//       }

//       const key = `${nik}#${tglFormat}`;

//       let firstCheckin: string | null = null;
//       let lastCheckin: string | null = null;
//       let checkinRange = 'Tidak ada checkin';

//       if (mapCheckin[key] && mapCheckin[key].length > 0) {
//         const times = mapCheckin[key]
//           .map(t => new Date(t).toISOString().slice(11, 19))
//           .sort();
//         firstCheckin = times[0];
//         lastCheckin = times[times.length - 1];
//         checkinRange = `${firstCheckin} - ${lastCheckin}`;
//       }

//       return {
//         ...row,
//         JamMasuk: firstCheckin,
//         JamPulang: lastCheckin,
//         RangeCheckin: checkinRange,
//       };
//     });
//   }
// }
