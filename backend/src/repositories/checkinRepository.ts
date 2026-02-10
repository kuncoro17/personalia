// import SDMCheckinout from '../models/SDMCheckinout';
// import { Op } from 'sequelize';

// export class CheckinRepository {
//   async getByRange(start: string, end: string) {
//     return await SDMCheckinout.findAll({
//       where: {
//         checktime: {
//           [Op.between]: [new Date(start), new Date(end)],
//         },
//       },
//       raw: true,
//     });
//   }
// }
