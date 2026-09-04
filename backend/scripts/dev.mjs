import { spawn } from 'node:child_process';
import path from 'node:path';

const tsxBinary = path.join(
  process.cwd(),
  'node_modules',
  '.bin',
  process.platform === 'win32' ? 'tsx.cmd' : 'tsx'
);

const child = spawn(tsxBinary, ['watch', 'src/app.ts'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    PORT: process.env.PORT ?? '3001',
    NODE_ENV: process.env.NODE_ENV ?? 'development',
    DB_HOST: process.env.DB_HOST ?? 'localhost',
    DB_PORT: process.env.DB_PORT ?? '5433',
    REDIS_HOST: process.env.REDIS_HOST ?? 'localhost',
    REDIS_PORT: process.env.REDIS_PORT ?? '6380',
  },
});

child.on('exit', code => {
  process.exit(code ?? 0);
});

child.on('error', error => {
  console.error('Failed to start backend dev server', error);
  process.exit(1);
});
