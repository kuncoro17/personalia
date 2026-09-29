import { describe, expect, it } from '@jest/globals';

import {
  expandWeekdays,
  getDatesInRange,
  mapLeaveRecord,
} from './leaveSyncService';

describe('leaveSyncService', () => {
  it('membuat daftar request satu kali untuk setiap tanggal dalam rentang', () => {
    expect(getDatesInRange('2026-09-28', '2026-10-01')).toEqual([
      '2026-09-28',
      '2026-09-29',
      '2026-09-30',
      '2026-10-01',
    ]);
  });

  it('mengabaikan Sabtu dan Minggu saat memecah rentang', () => {
    expect(
      expandWeekdays('2026-06-26T00:00:00.000Z', '2026-06-30T00:00:00.000Z')
    ).toEqual(['2026-06-26', '2026-06-29', '2026-06-30']);
  });

  it('memetakan satu data harian API menjadi satu baris tujuan', () => {
    const rows = mapLeaveRecord({
      id: 'abc',
      nik: ' 0123292 ',
      tanggal: '2026-07-23T00:00:00.000Z',
      tanggal_mulai: '2026-07-23T00:00:00.000Z',
      tanggal_selesai: '2026-07-24T00:00:00.000Z',
      jumlah_hari: 2,
      tipe_cuti: 'CTH',
      alasan_cuti: 'Liburan',
      status_persetujuan: 1,
      tanggal_persetujuan: '2026-07-13T08:32:13.398Z',
    });
    expect(rows).toEqual([
      {
        nik: '0123292',
        tglCuti: '2026-07-23',
        approvalDate: '2026-07-13',
        keperluan: 'Liburan',
        tipe: 'CTH',
      },
    ]);
  });

  it('mempertahankan data pada tanggal akhir pekan dari API sumber', () => {
    expect(
      mapLeaveRecord({
        id: 'abc',
        nik: '1',
        tanggal: '2026-07-25',
        tanggal_mulai: '2026-07-23',
        tanggal_selesai: '2026-07-25',
        jumlah_hari: 3,
        tipe_cuti: 'DNL',
        alasan_cuti: null,
        status_persetujuan: 1,
      })
    ).toEqual([
      expect.objectContaining({ tglCuti: '2026-07-25', tipe: 'DNL' }),
    ]);
  });
});
