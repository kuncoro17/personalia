// src/config/database.ts
import { Sequelize } from 'sequelize';

if (
  process.env.DB_NAME == null ||
  process.env.DB_USER == null ||
  process.env.DB_HOST == null ||
  process.env.DB_PORT == null ||
  process.env.DB_PASSWORD == null
) {
  throw new Error(
    '❌ Database environment variables are missing. Check .env file.'
  );
}

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: 'postgres',
    logging: false,
  }
);
export default sequelize;
