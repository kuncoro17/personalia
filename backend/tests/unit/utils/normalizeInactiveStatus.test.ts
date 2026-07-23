import { describe, expect, it } from '@jest/globals';

import { normalizeInactiveStatus } from '../../../src/utils/normalizeInactiveStatus';

describe('normalizeInactiveStatus', () => {
  it('mengubah status menjadi Tidak Aktif ketika checkbox dicentang', () => {
    expect(
      normalizeInactiveStatus({
        flag_inactive: true,
        tanggal_inactive: '2026-07-23',
      })
    ).toEqual({
      status_aktif: 'Tidak Aktif',
      tanggal_inactive: '2026-07-23',
    });
  });

  it('mengaktifkan kembali dan mengosongkan tanggal ketika checkbox dilepas', () => {
    expect(
      normalizeInactiveStatus({
        flag_inactive: false,
        tanggal_inactive: '2026-07-23',
      })
    ).toEqual({ status_aktif: 'Aktif', tanggal_inactive: null });
  });

  it('mengubah status ketika tanggal inactive dikirim tanpa checkbox', () => {
    expect(normalizeInactiveStatus({ tanggal_inactive: '2026-07-23' })).toEqual(
      {
        tanggal_inactive: '2026-07-23',
        status_aktif: 'Tidak Aktif',
      }
    );
  });
});
