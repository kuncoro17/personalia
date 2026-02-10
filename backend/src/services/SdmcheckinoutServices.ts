// import SdmCheckInOutRepository from '../repositories/SdmCheckinoutRepo';
// import {
//   BadRequestException,
//   NotFoundException,
// } from '../utils/http-exception'; // sesuaikan
// import logger from '../utils/logger';
// import dayjs from 'dayjs';
// import utc from 'dayjs/plugin/utc';
// import timezone from 'dayjs/plugin/timezone';

// dayjs.extend(utc);
// dayjs.extend(timezone);

// export default class SdmCheckInOutService {
//   private repo: SdmCheckInOutRepository;

//   constructor() {
//     this.repo = new SdmCheckInOutRepository();
//   }

//   /**
//    * Ambil 14 data check-in terbaru berdasarkan userid
//    */
//   async getLatest14ByUserId(userid: string) {
//     if (!userid) {
//       throw new BadRequestException('userid wajib diisi');
//     }

//     logger.info({ userid }, 'Get latest 14 checkinout');

//     const data = await this.repo.findLatest14(userid);

//     if (!data || data.length === 0) {
//       throw new NotFoundException(
//         `Data checkinout tidak ditemukan untuk userid: ${userid}`
//       );
//     }

//     // 🔥 FORMAT KE WIB DI SINI
//    return data.map((row) => ({
//   nik: row.nik,
//   employeename: row.employeename,
//   checktime: dayjs(row.checktime)
//     .tz('Asia/Jakarta')
//     .format('YYYY-MM-DD HH:mm:ss'),
// }));

//   }
// }
