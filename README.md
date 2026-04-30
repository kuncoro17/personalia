# Personalia JKT

Monorepo fullstack untuk aplikasi Personalia JKT.

- `backend`: Node.js API berbasis Hono
- `frontend`: React, Vite, Tailwind CSS, dan HeroUI
- `deployment`: Docker Compose, konfigurasi Nginx, dan observability

Repo ini memakai alur branch `dev` untuk staging dan `main` untuk production. Perubahan developer sebaiknya masuk lewat branch feature, dibuat Merge Request, lalu dimerge ke branch target sesuai kebutuhan release.

## Stack

- Node.js 20
- Backend: Hono, TypeScript, Sequelize, PostgreSQL, Redis
- Frontend: React 18, Vite, Tailwind CSS, HeroUI, React Router
- Auth: Clerk
- Runtime: Docker + Nginx
- CI/CD: GitLab CI

## Arsitektur Staging

Service utama di server:

- Frontend container: `127.0.0.1:3000`
- Backend container: `127.0.0.1:3001`
- Loki: `127.0.0.1:3100`
- Promtail: `127.0.0.1:9080`

Domain staging:

- Frontend: `https://staging-personalia.bpkpenaburjakarta.or.id`
- API publik: `https://api-staging-personalia.bpkpenaburjakarta.or.id`

Routing Nginx host:

- `staging-personalia...` path `/` -> `127.0.0.1:3000`
- `staging-personalia...` path `/api/` -> `127.0.0.1:3001`
- `api-staging-personalia...` -> `127.0.0.1:3001`

Catatan CORS untuk testing dari localhost:

- Kalau frontend dijalankan di `http://localhost:5173` dan `VITE_API_URL` diarahkan ke domain staging, browser akan melakukan request cross-origin ke `api-staging...`.
- Pastikan backend staging mengizinkan origin tersebut lewat `CORS_ALLOWED_ORIGINS`, contoh `http://localhost:5173`.

## Struktur Folder

```text
backend/
frontend/
deployment/
  be/
    init-db.sql
  compose/
    docker-compose.local.yml
    docker-compose.staging.yml
  nginx/
    staging/
      frontend.conf
      api.conf
  observability/
    loki-config.yaml
    promtail-config.yaml
.gitlab-ci.yml
```

## Local Development

Gunakan Node.js 20 atau versi LTS yang kompatibel.

Install dependency backend dan frontend:

```bash
npm --prefix backend ci
npm --prefix frontend ci
```

Jalankan backend:

```bash
npm --prefix backend run dev
```

Jalankan frontend:

```bash
npm --prefix frontend run dev
```

Default Vite dev server biasanya berjalan di:

```text
http://localhost:5173
```

Untuk cek sebelum membuat Merge Request:

```bash
npm run lint:check
npm run format:check
npm run test:ci
npm run build
```

## Local Docker

Contoh menjalankan stack lokal lewat Docker Compose:

```bash
docker compose \
  -f deployment/compose/docker-compose.local.yml \
  --env-file .env.example \
  up -d --build
```

Akses default lokal:

- Frontend: `http://localhost:3003`
- Backend: `http://localhost:3002`

Stop service:

```bash
docker compose -f deployment/compose/docker-compose.local.yml down
```

## Menjalankan Lokal Otomatis

Untuk local dev tanpa mengetik beberapa command manual:

```bash
npm run dev
```

Command ini akan menyiapkan frontend, menjalankan service Docker Compose yang dibutuhkan, menunggu backend sehat, lalu membuka flow lokal sesuai konfigurasi project.

Untuk menghentikan container Docker yang dinyalakan flow ini:

```bash
npm run dev:stop
```

## Environment Variables

Contoh variable ada di `.env.example`.

Untuk local development, buat file `.env` sendiri:

```bash
cp .env.example .env
```

Jangan commit file berikut:

- `.env`
- `.env.local`
- `.env.staging`
- `.env.production`
- secret key atau credential apa pun

Variable secret untuk staging dan production harus disimpan di GitLab CI/CD Variables, bukan di repository.

## Developer Workflow

Jangan kerja langsung di `main`.

Mulai dari branch terbaru:

```bash
git checkout dev
git pull origin dev
git checkout -b feature/login
```

Kerjakan perubahan, lalu cek di local sebelum push:

```bash
npm run lint:check
npm run format:check
npm run test:ci
npm run build
```

Jika sudah aman, commit dan push branch:

```bash
git add .
git commit -m "Add login feature"
git push -u origin feature/login
```

Setelah push selesai, buka GitLab web untuk membuat Merge Request.

## Membuat Merge Request di GitLab Web

1. Buka halaman project di GitLab.
2. Biasanya GitLab menampilkan tombol **Create merge request** untuk branch yang baru dipush.
3. Klik **Create merge request**.
4. Pastikan source branch adalah branch developer, contoh `feature/login`.
5. Pilih target branch sesuai tujuan:
   - `dev` untuk perubahan yang akan masuk staging.
   - `main` untuk release production.
6. Isi title dengan ringkas, contoh `Add login feature`.
7. Isi description dengan poin perubahan dan cara test jika ada.
8. Tunggu pipeline selesai.
9. Jika pipeline hijau dan review sudah oke, MR bisa di-merge.

Contoh nama branch:

- `feature/login`
- `feature/dashboard-filter`
- `fix/navbar-mobile`
- `fix/api-error-state`
- `chore/update-dependencies`

## CI/CD Flow

Pipeline GitLab menjalankan stage berikut:

- `validate`
- `build`
- `deploy-staging`
- `smoke-staging`
- `deploy-production`
- `smoke-production`

Saat Merge Request dibuat, pipeline menjalankan validasi backend dan frontend.

Saat branch `dev` diperbarui:

1. Backend dan frontend divalidasi.
2. Test backend berjalan.
3. Build frontend berjalan.
4. Docker image staging dibuat dan dipush ke registry.
5. Staging deploy otomatis.
6. Staging health check berjalan.

Saat branch `main` diperbarui:

1. Backend dan frontend divalidasi.
2. Test backend berjalan.
3. Build frontend berjalan.
4. Docker image production dibuat dan dipush ke registry.
5. Production deploy tersedia sebagai manual job.
6. Production health check berjalan setelah deploy sukses.

## Required GitLab CI/CD Variables

Shared:

- `CONTAINER_IMAGE`
- `SSH_PRIVATE_KEY`

Staging:

- `STAGING_SERVER_USER`
- `STAGING_SERVER_IP`
- `STAGING_DOMAIN`
- `STAGING_FE_API_URL`
- `STAGING_API_DOMAIN`
- `STAGING_FE_CLERK_SIGN_IN_URL`
- `STAGING_FE_CLERK_DOMAIN`
- `STAGING_FE_CLERK_IS_SATELLITE`

Production:

- `BACKEND_ENV_PRODUCTION`
- `PRODUCTION_SERVER_USER`
- `PRODUCTION_SERVER_IP`
- `PRODUCTION_DOMAIN`

Variable tambahan seperti `CLERK_*`, `VITE_*`, database, Redis, dan credential lain mengikuti kebutuhan environment masing-masing.

## Deployment Staging Manual

Jika perlu deploy manual di server:

```bash
cd /opt/personalia-jkt
export BACKEND_IMAGE='<registry>/personalia-jkt:backend-staging'
export FRONTEND_IMAGE='<registry>/personalia-jkt:frontend-staging'
export BACKEND_ENV_FILE='.env.staging'
docker compose -f deployment/compose/docker-compose.staging.yml pull
docker compose -f deployment/compose/docker-compose.staging.yml up -d --remove-orphans
```

Cek service:

```bash
docker compose -f deployment/compose/docker-compose.staging.yml ps
```

## Nginx Host

Template konfigurasi Nginx ada di:

- `deployment/nginx/staging/frontend.conf`
- `deployment/nginx/staging/api.conf`

Contoh pemasangan:

```bash
sudo cp deployment/nginx/staging/frontend.conf /etc/nginx/sites-available/personalia-frontend
sudo cp deployment/nginx/staging/api.conf /etc/nginx/sites-available/personalia-api
sudo ln -sf /etc/nginx/sites-available/personalia-frontend /etc/nginx/sites-enabled/personalia-frontend
sudo ln -sf /etc/nginx/sites-available/personalia-api /etc/nginx/sites-enabled/personalia-api
sudo nginx -t && sudo systemctl reload nginx
```

SSL dijalankan manual di server, misalnya dengan Let's Encrypt.

## Useful Commands

Update branch feature dengan perubahan terbaru dari `dev`:

```bash
git checkout dev
git pull origin dev
git checkout feature/login
git merge dev
```

Hapus branch local setelah MR sudah merge:

```bash
git checkout dev
git pull origin dev
git branch -d feature/login
```

Preview production build frontend secara local:

```bash
npm --prefix frontend run build
npm --prefix frontend run preview
```

## Troubleshooting Singkat

1. Missing CI variable

Tambahkan variable yang disebutkan error ke GitLab CI/CD Variables.

2. Container backend/frontend tidak healthy

Cek log container di server:

```bash
docker logs personalia-jkt-backend --tail 200
docker logs personalia-jkt-frontend --tail 200
```

3. `no space left on device` saat deploy

Bersihkan Docker cache, image lama, dan container yang tidak dipakai di server.
