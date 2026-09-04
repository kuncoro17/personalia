# Database Migrations

Project ini memakai migration runner berbasis Sequelize + TypeScript.

## Lokasi File

- Runner: `src/scripts/migrate.ts`
- Generator file: `src/scripts/create-migration.ts`
- Folder migration: `src/migrations/*.ts`
- Tabel tracking: `schema_migrations`

## Perintah

- Jalankan migration pending: `npm run migrate`
- Lihat status migration: `npm run migrate:status`
- Rollback 1 migration terakhir: `npm run migrate:undo`
- Buat file migration baru: `npm run migrate:create -- nama-migration`

## Format Migration

Setiap file migration export object default:

```ts
import type { Migration } from '../types/migration';

const migration: Migration = {
  async up({ queryInterface, transaction }) {
    // apply changes
  },

  async down({ queryInterface, transaction }) {
    // rollback changes
  },
};

export default migration;
```

Disarankan memakai `transaction` saat memanggil `queryInterface`.
