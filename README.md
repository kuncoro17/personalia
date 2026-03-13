# Personalia JKT (Fullstack)

Monorepo fullstack untuk aplikasi Personalia JKT:

- `backend` (Node.js API)
- `frontend` (Vite)
- `deployment` (Docker Compose, Nginx template, observability)

## Arsitektur Staging

Staging dijalankan dengan Docker Compose di server, sedangkan Nginx berjalan di host (manual, bukan container).

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
    promtail-staging-config.yaml
.gitlab-ci.yml
```

## Menjalankan Lokal (Docker)

Contoh cepat:

```bash
docker compose \
  -f deployment/compose/docker-compose.local.yml \
  --env-file .env.example \
  up -d --build
```

Akses default lokal:

- FE: `http://localhost:3003`
- BE: `http://localhost:3002`

Stop:

```bash
docker compose -f deployment/compose/docker-compose.local.yml down
```

## CI/CD (GitLab)

Pipeline utama tetap:

- `validate`
- `test`
- `build`
- `deploy`
- `post-deploy` (health-check)

Deploy staging dilakukan dari branch `dev`.
Deploy production dilakukan manual dari branch `main`.

### CI Variables Wajib (Staging)

- `SSH_PRIVATE_KEY`
- `STAGING_SERVER_USER`
- `STAGING_SERVER_IP`
- `STAGING_DOMAIN`
- `STAGING_FE_CLERK_PUBLISHABLE_KEY`

### CI Variables Opsional (Staging)

- `STAGING_API_DOMAIN` (default: `api-staging-personalia.bpkpenaburjakarta.or.id`)
- `STAGING_FE_API_URL` (default: `/api`)
- `STAGING_FE_CLERK_SIGN_IN_URL`
- `STAGING_FE_CLERK_DOMAIN`
- `STAGING_FE_CLERK_IS_SATELLITE` (default: `true`)

### CI Variables Wajib (Production)

- `BACKEND_ENV_PRODUCTION`
- `PRODUCTION_SERVER_USER`
- `PRODUCTION_SERVER_IP`
- `PRODUCTION_DOMAIN`
- `PRODUCTION_FE_CLERK_PUBLISHABLE_KEY`

### CI Variables Opsional (Production)

- `PRODUCTION_FE_API_URL` (default: `/api`)
- `PRODUCTION_FE_CLERK_SIGN_IN_URL`
- `PRODUCTION_FE_CLERK_DOMAIN`
- `PRODUCTION_FE_CLERK_IS_SATELLITE` (default: `false`)

Catatan:

- File `frontend/.env` hanya untuk lokal/developer machine.
- Build image frontend di CI memakai `--build-arg` dari CI variables, bukan dari `frontend/.env`.

## Deploy Staging Manual di Server (Jika Diperlukan)

Masuk server:

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

## Nginx Host (Manual)

File template ada di repo:

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

SSL dijalankan manual di server (Let's Encrypt).

## Health Checks

Health-check staging mengecek:

- container backend/frontend/loki/promtail
- endpoint lokal:
  - `http://127.0.0.1:3001/health`
  - `http://127.0.0.1:3000/`
  - `http://127.0.0.1:3100/ready`
  - `http://127.0.0.1:9080/ready`
- endpoint publik FE dan API

## Troubleshooting Singkat

1. `Missing CI variable: STAGING_FE_CLERK_PUBLISHABLE_KEY`

- Tambahkan variable tersebut di GitLab CI/CD.

2. Loki restart / unhealthy

- Cek `deployment/observability/loki-config.yaml` sudah tersalin benar.
- Cek log: `docker logs personalia-loki --tail 200`.

3. Promtail `unhealthy` karena `wget not found`

- Gunakan compose terbaru (healthcheck promtail sudah dihapus di staging).

4. `no space left on device` saat deploy

- Bersihkan Docker cache/image/container di server staging.
