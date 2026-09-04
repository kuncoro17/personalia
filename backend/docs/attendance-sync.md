# Sinkronisasi attendance MySQL ke PostgreSQL

Sinkronisasi membaca `new_attendance.record` di PC server MySQL dan menulisnya
ke `public.sdm_checkinout` di PostgreSQL lokal.

## Mapping kolom

| MySQL `record` | PostgreSQL `sdm_checkinout` |
| --- | --- |
| `id` | `id` |
| `user_id` | `userid` |
| `stime` | `checktime` |
| `s` | `checktype` |
| `p` | `verifycode` |
| `mesin_id` | `machine` |
| `created` | `created` |
| nilai tetap `sync` | `createdby` |

Hanya baris dengan `sudah_sync = 0` dan `stime` mulai tanggal konfigurasi yang
diambil. Setelah commit PostgreSQL berhasil, baris sumber ditandai
`sudah_sync = 1`. Apabila update MySQL gagal setelah commit, proses berikutnya
tetap aman: data dengan `id` yang sudah ada tidak dimasukkan dua kali.

## Konfigurasi

Salin variabel berikut ke `.env` backend. Kredensial PostgreSQL menggunakan
variabel `DB_*` yang sudah dipakai aplikasi.

```dotenv
ATTENDANCE_MYSQL_HOST=192.168.66.20
ATTENDANCE_MYSQL_PORT=3306
ATTENDANCE_MYSQL_DATABASE=new_attendance
ATTENDANCE_MYSQL_USER=root
ATTENDANCE_MYSQL_PASSWORD=
ATTENDANCE_MYSQL_TIMEZONE=+07:00
ATTENDANCE_MYSQL_CONNECT_TIMEOUT_MS=10000

ATTENDANCE_SYNC_BATCH_SIZE=500
ATTENDANCE_SYNC_FROM_DATE=1970-01-01
# ATTENDANCE_SYNC_MAX_BATCHES=10
ATTENDANCE_SYNC_DRY_RUN=true
```

MySQL harus menerima koneksi TCP dari mesin yang menjalankan backend. Pastikan
port 3306 dapat dijangkau dan akun MySQL memiliki hak `SELECT` dan `UPDATE`
pada tabel `new_attendance.record`.

## Menjalankan

Uji koneksi dan validasi data tanpa mengubah kedua database:

```bash
cd backend
npm run sync:attendance
```

Jika dry-run berhasil, ubah `ATTENDANCE_SYNC_DRY_RUN=false`, lalu jalankan
perintah yang sama. Hasil log menampilkan jumlah baris yang diproses,
dimasukkan, dan yang sebelumnya sudah ada.

Sinkronisasi juga tersedia melalui endpoint berikut ketika backend aktif:

```text
POST /personalia/attendance/sync?dryRun=false&batchSize=500&maxBatches=10&fromDate=1970-01-01
```

Endpoint wajib memakai header API key yang sama dengan endpoint internal
Personalia lainnya. Untuk proses berkala, jadwalkan perintah CLI melalui cron
atau scheduler server; jangan menjalankan dry-run pada jadwal produksi.

## Catatan skema

- `public.sdm_checkinout.id` saat ini diperlakukan sebagai identitas unik.
- Jika nilai `record.id` dapat melewati `2147483647`, ubah kolom tujuan menjadi
  `BIGINT` lebih dahulu.
- Nilai `record.s` harus muat pada kolom tujuan `checktype VARCHAR(1)`.
