import { describe, expect, it } from '@jest/globals';

import { getJakartaDateOnly } from '../../../src/utils/dateOnly';

describe('getJakartaDateOnly', () => {
  it('menggunakan tanggal Asia/Jakarta saat UTC masih hari sebelumnya', () => {
    const date = new Date('2026-07-22T18:30:00.000Z');

    expect(getJakartaDateOnly(date)).toBe('2026-07-23');
  });
});
