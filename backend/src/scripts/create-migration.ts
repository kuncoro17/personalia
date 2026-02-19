import dotenv from 'dotenv';
import fs from 'node:fs/promises';
import path from 'node:path';

import logger from '../utils/logger';

dotenv.config();

const MIGRATIONS_DIR = path.resolve(process.cwd(), 'src/migrations');

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const buildTimestamp = (date = new Date()): string => {
  const pad = (n: number) => String(n).padStart(2, '0');
  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
    pad(date.getHours()),
    pad(date.getMinutes()),
    pad(date.getSeconds()),
  ].join('');
};

const TEMPLATE = `import type { Migration } from '../types/migration';

const migration: Migration = {
  async up() {
    // TODO: tulis perubahan schema di sini
  },

  async down() {
    // TODO: rollback perubahan schema di sini
  },
};

export default migration;
`;

const run = async (): Promise<void> => {
  const nameArg = process.argv.slice(2).join(' ').trim();
  if (!nameArg) {
    throw new Error(
      'Nama migration wajib diisi. Contoh: npm run migrate:create -- add-user-status-column'
    );
  }

  const slug = slugify(nameArg);
  if (!slug) {
    throw new Error('Nama migration tidak valid.');
  }

  const fileName = `${buildTimestamp()}-${slug}.ts`;
  const filePath = path.join(MIGRATIONS_DIR, fileName);

  await fs.mkdir(MIGRATIONS_DIR, { recursive: true });
  await fs.writeFile(filePath, TEMPLATE, 'utf8');

  logger.info({ file: filePath }, 'Migration file berhasil dibuat');
};

run()
  .then(() => process.exit(0))
  .catch(error => {
    logger.error({ err: error }, 'Gagal membuat migration file');
    process.exit(1);
  });
