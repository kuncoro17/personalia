#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

LOCAL_HOST="${LOCAL_HOST:-localhost}"
LOCAL_PORT="${LOCAL_PORT:-5432}"
LOCAL_DB="${LOCAL_DB:-personalia}"
LOCAL_USER="${LOCAL_USER:-postgres}"

CONTAINER_DB="${CONTAINER_DB:-personalia}"
CONTAINER_USER="${CONTAINER_USER:-postgres}"

# Provide env files to docker compose so variable interpolation doesn't emit warnings.
COMPOSE_ENV_ARGS=(--env-file "$ROOT_DIR/backend/.env" --env-file "$ROOT_DIR/frontend/.env")

MODE="empty-only"
if [[ "${1:-}" == "--all" ]]; then
  MODE="all"
  shift
fi

if [[ "${1:-}" == "--help" ]]; then
  cat <<'EOF'
Seed Postgres docker-compose DB from local Postgres DB (host machine).

Default: seeds only tables that are empty in the docker DB.
Use --all to TRUNCATE and reseed all tables listed.

Environment overrides:
  LOCAL_HOST, LOCAL_PORT, LOCAL_DB, LOCAL_USER
  CONTAINER_DB, CONTAINER_USER

Examples:
  scripts/seed-db-from-local.sh
  scripts/seed-db-from-local.sh --all
  LOCAL_DB=personalia LOCAL_USER=postgres scripts/seed-db-from-local.sh --all
EOF
  exit 0
fi

cd "$ROOT_DIR"

psql_local() {
  PGPASSWORD="${PGPASSWORD:-}" \
    psql -h "$LOCAL_HOST" -p "$LOCAL_PORT" -U "$LOCAL_USER" -d "$LOCAL_DB" "$@"
}

psql_container() {
  docker compose "${COMPOSE_ENV_ARGS[@]}" exec -T postgres \
    psql -U "$CONTAINER_USER" -d "$CONTAINER_DB" "$@"
}

get_columns() {
  local runner="$1"
  local table="$2"
  "$runner" -Atc \
    "SELECT column_name
     FROM information_schema.columns
     WHERE table_schema='public'
       AND table_name='${table}'
     ORDER BY ordinal_position;"
}

quote_ident_list() {
  # Input: newline-separated column names. Output: "a","b","c"
  awk 'NF { gsub(/"/, "\"\""); printf "%s\"%s\"", (NR==1?"":","), $0 } END { printf "\n" }'
}

join_list() {
  # Input: newline-separated SQL snippets. Output: <line1>,<line2>,...
  awk 'NF { printf "%s%s", (NR==1?"":","), $0 } END { printf "\n" }'
}

build_local_select_list() {
  # Input: newline-separated column names.
  # Output: SQL select list with safe fallbacks for common audit columns.
  # Example: COALESCE("created_at", NOW()) AS "created_at","kode"
  while IFS= read -r col; do
    [[ -z "$col" ]] && continue

    case "$col" in
      created_at|updated_at)
        printf 'COALESCE("%s", NOW()) AS "%s"\n' "$col" "$col"
        ;;
      *)
        printf '"%s"\n' "$col"
        ;;
    esac
  done
}

intersect_columns() {
  # Args: local_cols container_cols. Output: common cols (newline-separated), in local order.
  local local_cols="$1"
  local container_cols="$2"

  # Avoid passing multi-line values via awk -v (can break on some awk builds).
  local tmp
  tmp="$(mktemp)"
  printf '%s\n' "$container_cols" >"$tmp"

  while IFS= read -r col; do
    [[ -z "$col" ]] && continue
    if grep -Fxq -- "$col" "$tmp"; then
      printf '%s\n' "$col"
    fi
  done <<<"$local_cols"

  rm -f "$tmp"
}

table_count() {
  local runner="$1"
  local table="$2"
  "$runner" -Atc "SELECT COUNT(*) FROM \"${table}\";"
}

copy_table() {
  local table="$1"
  local cols_nl="$2"

  local cols_quoted select_list
  cols_quoted="$(quote_ident_list <<<"$cols_nl")"
  select_list="$(build_local_select_list <<<"$cols_nl" | join_list)"

  if [[ -z "$cols_quoted" ]]; then
    echo "[skip] $table (no common columns)"
    return 0
  fi

  if [[ "$MODE" == "empty-only" ]]; then
    local current
    current="$(table_count psql_container "$table" | tail -n 1)"
    if [[ "$current" != "0" ]]; then
      echo "[skip] $table (container has $current rows)"
      return 0
    fi
  else
    echo "[truncate] $table"
    psql_container -v ON_ERROR_STOP=1 -c "TRUNCATE TABLE \"${table}\" CASCADE;"
  fi

  echo "[seed] $table"

  # Stream CSV from local into container using COPY (no client-side \\copy).
  if psql_local -v ON_ERROR_STOP=1 -Atc \
    "COPY (SELECT ${select_list} FROM \"${table}\") TO STDOUT WITH CSV" \
    | psql_container -v ON_ERROR_STOP=1 -c \
      "COPY \"${table}\" (${cols_quoted}) FROM STDIN WITH CSV"; then
    return 0
  fi

  echo "[error] $table (seed failed, skipped)"
  return 0
}

TABLES="$(
  psql_container -Atc \
    "SELECT relname
     FROM pg_class c
     JOIN pg_namespace n ON n.oid=c.relnamespace
     WHERE n.nspname='public'
       AND c.relkind='r'
       AND relname <> 'schema_migrations'
     ORDER BY relname;"
)"

echo "Mode: $MODE"
echo "Local: ${LOCAL_USER}@${LOCAL_HOST}:${LOCAL_PORT}/${LOCAL_DB}"
echo "Docker: ${CONTAINER_USER}@postgres:5432/${CONTAINER_DB}"

# Bash 3.2 (macOS default) doesn't support `mapfile`.
old_ifs="$IFS"
set -f
IFS=$'\n' table_list=($TABLES)
IFS="$old_ifs"
set +f

for table in "${table_list[@]}"; do
  [[ -z "$table" ]] && continue

  # Skip internal or log tables unless --all explicitly asked for everything.
  if [[ "$MODE" == "empty-only" && ( "$table" == "app_logs" || "$table" == "history" ) ]]; then
    continue
  fi

  local_cols="$(get_columns psql_local "$table" || true)"
  container_cols="$(get_columns psql_container "$table" || true)"

  if [[ -z "$local_cols" || -z "$container_cols" ]]; then
    echo "[skip] $table (missing columns on one side)"
    continue
  fi

  common_cols="$(intersect_columns "$local_cols" "$container_cols")"
  if [[ -z "$common_cols" ]]; then
    echo "[skip] $table (no common columns)"
    continue
  fi

  copy_table "$table" "$common_cols"
done

echo "Done."
