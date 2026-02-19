import type { Migration } from '../types/migration';

const migration: Migration = {
  async up() {
    // Initial marker migration.
    // Gunakan file migration baru untuk perubahan schema berikutnya.
  },

  async down() {
    // No-op rollback.
  },
};

export default migration;

