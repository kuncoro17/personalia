// import { Context, Next } from 'hono';
// import { sequelize } from '../config/database';

// export const debugMiddleware = async (c: Context, next: Next) => {
//   // console.log('--------------------------------------------------');
//   // console.log('➡️ Method:', c.req.method);
//   // console.log('➡️ Path:', c.req.path);
//   // console.log('➡️ Query:', c.req.query());
//   // console.log('➡️ Params:', c.req.param());
//   // console.log('➡️ Headers:', c.req.header());
//   // console.log('🔥 SQL Debugger: ON');

//   // Simpan logger asli
//   const originalLogging = sequelize.options.logging;

//   // Aktifkan logging SQL per request
//   // sequelize.options.logging = (msg: string) => {
//   //   // console.log('🟦 SQL:', msg);
//   // };

//   // Jalankan request
//   await next();

//   // Kembalikan logger asli
//   sequelize.options.logging = originalLogging;

//   // console.log('🔥 SQL Debugger: OFF');
//   // console.log('--------------------------------------------------');
// };
