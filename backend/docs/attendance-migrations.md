# Migration tabel dan routine absensi

Migration berikut menyalin struktur dan definisi dari PostgreSQL yang dikonfigurasi
di backend pada 11 September 2026:

1. `20260911000001-create-sdm-checkinout`: tabel `public.sdm_checkinout`.
2. `20260911000002-create-sdm-checkinout-cuti`: tabel
   `public.sdm_checkinout_cuti`, primary key `(nik, tgl_cuti)`, dan index
   `idx_cuti_nik_date`.
3. `20260911000003-create-attendance-routines`: function `get_absensi_pivot(date, date)`,
   procedure `get_absensi_pivot_1(date, date)`, kedua overload
   `get_absensi_pivot_bagian` (`varchar` dan `text`), serta `test_cursor(refcursor)`.
   Definisi SQL tersimpan di `src/migrations/sql/attendance-routines.ts`.

Jalankan dari direktori backend dengan konfigurasi database tujuan yang sesuai:

```bash
cd backend
npm run migrate:status
npm run migrate
```

Runner menjalankan setiap migration dalam transaksi. Tabel dibuat dengan
`IF NOT EXISTS`, sehingga tabel dan data lama tetap dipertahankan. Migration ini
tidak menyelaraskan kolom atau constraint tabel yang sudah ada. Routine diperiksa
dengan `to_regprocedure` menggunakan schema, nama, dan tipe parameter lengkap
(termasuk `INOUT`). Routine yang sudah ada dilewati dan dicatat di log; definisi,
return type, owner, dan grants tetap dipertahankan. Routine yang belum ada dibuat
menggunakan signature dan body asli dari snapshot. Overload `text` dan `varchar`
diperiksa secara terpisah.

Jika deployment sebelumnya gagal dengan `cannot change return type of existing
function` (`42P13`), gunakan image dari commit perbaikan ini lalu jalankan ulang
deployment. Migration routine yang gagal sudah di-rollback oleh transaksi runner
dan belum dicatat selesai. Dua migration tabel yang berhasil akan dilewati
otomatis. Tidak perlu menghapus function atau mengubah `schema_migrations`.
Database yang sudah menyelesaikan baseline ini tidak akan menjalankannya ulang.

`sdm_checkinout.id` tetap `integer` tanpa sequence, default, maupun primary key,
sesuai database sumber. Timestamp tetap `timestamp without time zone`.
Migration tidak memasukkan data absensi atau cuti.

Ketiga migration ini merupakan baseline untuk objek yang dapat sudah ada sebelum
pencatatan migration. `migrate:undo` akan menolak rollback baseline agar tidak
menghapus tabel berisi data atau routine sebelumnya. Untuk mengubah atau memulihkan
definisi, tambahkan migration baru.

Routine laporan membutuhkan tabel master `prs_karyawan`,
`prs_unit_kerja_karyawan`, `prs_unit_kerja`, `prs_divisi`, dan `prs_bagian` saat
dipanggil; tabel master tersebut tidak termasuk migration ini.

Database sumber memiliki `get_absensi_pivot` sebagai **function dua parameter**,
sedangkan `AbsensiRepository.getAbsensiPivot` memanggil **procedure tiga parameter**.
Migration mempertahankan definisi sumber; ketidaksesuaian pemanggilan tersebut
perlu ditangani terpisah. Kedua overload `get_absensi_pivot_bagian` juga memiliki
logika rentang tanggal yang berbeda dan tetap dipertahankan sesuai sumber.
