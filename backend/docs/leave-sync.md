# Sinkronisasi cuti dan izin ke PostgreSQL

Proses ini mengambil data yang sudah disetujui dari API SDM Izin. API sumber
sudah mengirim satu item untuk setiap tanggal, sehingga setiap item disimpan
sebagai satu baris di `public.sdm_checkinout_cuti`, termasuk tanggal nonkerja
bila ada pada respons sumber.

## Mapping

| API                                                       | PostgreSQL      |
| --------------------------------------------------------- | --------------- |
| `nik`                                                     | `nik`           |
| `tanggal`                                                 | `tgl_cuti`      |
| tanggal dari `tanggal_persetujuan`                        | `approval_date` |
| `alasan_cuti`                                             | `keperluan`     |
| `tipe_cuti`                                               | `tipe`          |

Data dicocokkan berdasarkan `(nik, tgl_cuti)`. Baris yang sudah ada akan
diperbarui dan baris yang belum ada akan dimasukkan; perubahan data sumber akan
mengatur `flag_pump` kembali ke `0`. Proses ini tidak memerlukan unique
constraint tambahan. Jika API mengirim lebih dari satu tipe untuk NIK dan
tanggal yang sama, data pertama dari respons sumber yang disimpan.

## Konfigurasi dan eksekusi

```dotenv
LEAVE_SYNC_API_URL=https://staging-sdm-izin.bpkpenaburjakarta.or.id/api/sdm-cuti/approved-summary
LEAVE_SYNC_API_KEY=isi-secret-di-sini
# Opsional. Jika kosong, proses memakai tanggal hari ini (Asia/Jakarta).
LEAVE_SYNC_START_DATE=
LEAVE_SYNC_END_DATE=
LEAVE_SYNC_TIMEOUT_MS=15000
LEAVE_SYNC_DRY_RUN=true
```

Jalankan dry-run terlebih dahulu:

```bash
cd backend
npm run sync:leave
```

Setelah hasil valid, ubah `LEAVE_SYNC_DRY_RUN=false`. Proses juga dapat dipicu
melalui `POST /personalia/leave/sync?dryRun=false`. API sumber membutuhkan
parameter `start_date` dan `end_date`; nilainya dibaca dari
`LEAVE_SYNC_START_DATE` dan `LEAVE_SYNC_END_DATE` atau dapat ditentukan per
request melalui `startDate` dan `endDate`. Jika tidak diisi, keduanya otomatis
menggunakan tanggal hari ini dalam zona waktu Jakarta. Contoh request rentang:
`POST /personalia/leave/sync?dryRun=false&startDate=2026-01-01&endDate=2026-12-31`. Endpoint ini tidak
membutuhkan header `x-api-key`; credential API sumber dibaca langsung oleh
backend dari `LEAVE_SYNC_API_KEY`. Untuk sinkron berkala, jadwalkan
`npm run sync:leave` melalui cron atau scheduler server.

Untuk setiap hari dalam rentang tersebut, backend memanggil API IZI secara
berurutan dengan `start_date` dan `end_date` yang sama. Contoh untuk 29
September 2026: `?start_date=2026-09-29&end_date=2026-09-29`.

## Membaca hasil sinkronisasi

Data tersimpan dapat dibaca tanpa header autentikasi:

```text
GET /personalia/leave
```

Endpoint mengembalikan seluruh isi tabel dalam array `data`, diurutkan dari
`tgl_cuti` terbaru.
