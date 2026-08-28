import { expandWeekdays, mapLeaveRecord } from './leaveSyncService';

describe('leaveSyncService', () => {
  it('mengabaikan Sabtu dan Minggu saat memecah rentang', () => {
    expect(
      expandWeekdays(
        '2026-06-26T00:00:00.000Z',
        '2026-06-30T00:00:00.000Z'
      )
    ).toEqual(['2026-06-26', '2026-06-29', '2026-06-30']);
  });

  it('memetakan satu pengajuan menjadi satu baris per hari kerja', () => {
    const rows = mapLeaveRecord({
      id: 'abc',
      nik: ' 0123292 ',
      tanggal_mulai: '2026-07-23T00:00:00.000Z',
      tanggal_selesai: '2026-07-24T00:00:00.000Z',
      jumlah_hari: 2,
      tipe_cuti: 'CTH',
      alasan_cuti: 'Liburan',
      status_persetujuan: 1,
      tanggal_persetujuan: '2026-07-13T08:32:13.398Z',
      deleted_at: null,
    });
    expect(rows).toEqual([
      {
        nik: '0123292',
        tglCuti: '2026-07-23',
        approvalDate: '2026-07-13',
        keperluan: 'Liburan',
        tipe: 'CTH',
      },
      {
        nik: '0123292',
        tglCuti: '2026-07-24',
        approvalDate: '2026-07-13',
        keperluan: 'Liburan',
        tipe: 'CTH',
      },
    ]);
  });

  it('menolak jumlah hari yang tidak konsisten', () => {
    expect(() =>
      mapLeaveRecord({
        id: 'abc',
        nik: '1',
        tanggal_mulai: '2026-07-23',
        tanggal_selesai: '2026-07-24',
        jumlah_hari: 1,
        tipe_cuti: 'CTH',
        alasan_cuti: null,
        status_persetujuan: 1,
        tanggal_persetujuan: null,
        deleted_at: null,
      })
    ).toThrow('tidak konsisten');
  });
});
