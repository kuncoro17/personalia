// src/config/database.ts
import { Sequelize } from 'sequelize';

const readNonNegativeInteger = (name: string, fallback: number): number => {
  const raw = process.env[name];
  if (raw == null || raw.trim() === '') return fallback;

  const value = Number(raw);
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new Error(`${name} must be a non-negative integer`);
  }

  return value;
};

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
    pool: {
      max: readNonNegativeInteger('DB_POOL_MAX', 10),
      min: readNonNegativeInteger('DB_POOL_MIN', 0),
      acquire: readNonNegativeInteger('DB_POOL_ACQUIRE_MS', 30_000),
      idle: readNonNegativeInteger('DB_POOL_IDLE_MS', 10_000),
    },
  }
);
export default sequelize;
