# Pengujian

Unit test ditempatkan di project yang sama dengan kode yang diuji agar perubahan kode,
test, dan pipeline selalu bergerak bersama.

## Menjalankan test

```bash
cd backend
npm test
```

```bash
cd frontend
npm test
```

Pipeline memakai `npm run test:ci` pada masing-masing aplikasi. Unit test backend ada
di `backend/tests/unit`, sedangkan unit test frontend ada di `frontend/tests/unit`.
Test integrasi dapat ditambahkan terpisah di folder `tests/integration` tanpa membuat
repository baru.

Contract test seluruh endpoint backend berada di `backend/tests/api`. Test ini menjaga
jumlah dan bentuk seluruh method/path API aktif, kelengkapan CRUD, endpoint khusus yang
dipakai frontend, health check, CORS, serta respons 404. Ketika endpoint sengaja
ditambah atau dihapus, perbarui manifest jumlah keluarga endpoint pada contract test.

Nama test sebaiknya menggambarkan perilaku bisnis yang diverifikasi. Setiap perbaikan
bug idealnya disertai test regresi yang gagal sebelum perbaikan dan lulus sesudahnya.
