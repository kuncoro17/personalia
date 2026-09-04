#!/bin/sh

set -eu

env_file="${1:-}"

if [ -z "$env_file" ] || [ ! -s "$env_file" ]; then
  echo "PRODUCTION_ENV_FILE is missing or empty"
  exit 1
fi

read_value() {
  awk -v key="$1" '
    index($0, key "=") == 1 {
      sub(/^[^=]*=/, "")
      sub(/\r$/, "")
      print
      found=1
      exit
    }
    END { if (!found) exit 1 }
  ' "$env_file"
}

for variable in \
  NODE_ENV \
  PORT \
  AUTO_SYNC_MODELS \
  DB_HOST \
  DB_PORT \
  DB_NAME \
  DB_USER \
  DB_PASSWORD \
  REDIS_HOST \
  REDIS_PORT \
  CLERK_SECRET_KEY \
  CLERK_JWT_KEY \
  CLERK_AUTHORIZED_PARTIES \
  JWT_SECRET \
  SAS_AUTO_LOGIN_SECRET \
  PERSONALIA_API_KEY; do
  value="$(read_value "$variable")" || {
    echo "$variable is missing from PRODUCTION_ENV_FILE"
    exit 1
  }

  case "$value" in
    ""|"change this"|change-me*|your_*)
      echo "$variable is not configured in PRODUCTION_ENV_FILE"
      exit 1
      ;;
  esac
done

node_env="$(read_value NODE_ENV)"
auto_sync_models="$(read_value AUTO_SYNC_MODELS)"

if [ "$node_env" != "production" ]; then
  echo "NODE_ENV must be production in PRODUCTION_ENV_FILE"
  exit 1
fi

if [ "$auto_sync_models" != "false" ]; then
  echo "AUTO_SYNC_MODELS must be false in PRODUCTION_ENV_FILE"
  exit 1
fi

for variable in PORT DB_PORT REDIS_PORT; do
  value="$(read_value "$variable")"
  case "$value" in
    ""|*[!0-9]*)
      echo "$variable must be a positive integer in PRODUCTION_ENV_FILE"
      exit 1
      ;;
  esac

  if [ "$value" -eq 0 ]; then
    echo "$variable must be a positive integer in PRODUCTION_ENV_FILE"
    exit 1
  fi
done

unset auto_sync_models env_file node_env value variable
