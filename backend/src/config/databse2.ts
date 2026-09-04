// // src/config/database.ts
// import { Sequelize } from 'sequelize';

// if (
//   !process.env.DB_NAME_MYSQL ||
//   !process.env.DB_USER_MYSQL ||
//   !process.env.DB_PASSWORD_MYSQL
// ) {
//   throw new Error(
//     '❌ Database environment variables are missing. Check .env file.'
//   );
// }

// export const sequelize = new Sequelize(
//   process.env.DB_NAME_MYSQL,
//   process.env.DB_USER_MYSQL,
//   process.env.DB_PASSWORD_MYSQL,
//   {

//     host: process.env.DB_HOST_MYSQL,
//     port: Number(process.env.DB_PORT_MYSQL),
//     timezone: '+07:00',
//     dialect: 'mysql',
//     logging: false,
//   }
// );
// export default sequelize;
