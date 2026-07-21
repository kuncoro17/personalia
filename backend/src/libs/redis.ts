import 'dotenv/config';
import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
  db: 0,
  lazyConnect: process.env.NODE_ENV === 'test',
  retryStrategy: times => Math.min(times * 50, 2000),
});

redis.on('connect', () => {});

export default redis;

// import Redis from 'ioredis';
// import dotenv from 'dotenv';
// dotenv.config();

// const redisPort = Number(process.env.REDIS_PORT ?? 6379);

// if (!Number.isInteger(redisPort)) {
//   throw new Error('REDIS_PORT is missing or invalid');
// }

// const redis = new Redis({
//   host: process.env.REDIS_HOST ?? '127.0.0.1',
//   port: redisPort,
//   password: process.env.REDIS_PASSWORD || undefined,
// });
// redis.on("connect", () => console.log("Redis connected!"));
// redis.on("error", (err) => console.error("Redis error:", err));

// export default redis;
