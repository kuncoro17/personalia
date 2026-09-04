#!/bin/sh

set -eu

env_file="${1:-}"

configuration_error() {
  echo "APPLICATION_CONFIGURATION_ERROR: $*" >&2
  exit 1
}

if [ -z "$env_file" ] || [ ! -s "$env_file" ]; then
  configuration_error "PRODUCTION_ENV_FILE is missing or empty"
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
    configuration_error "$variable is missing from PRODUCTION_ENV_FILE"
  }

  case "$value" in
    ""|"change this"|change-me*|your_*)
      configuration_error "$variable is not configured in PRODUCTION_ENV_FILE"
      ;;
  esac
done

node_env="$(read_value NODE_ENV)"
auto_sync_models="$(read_value AUTO_SYNC_MODELS)"

if [ "$node_env" != "production" ]; then
  configuration_error "NODE_ENV must be production in PRODUCTION_ENV_FILE"
fi

if [ "$auto_sync_models" != "false" ]; then
  configuration_error "AUTO_SYNC_MODELS must be false in PRODUCTION_ENV_FILE"
fi

for variable in PORT DB_PORT REDIS_PORT; do
  value="$(read_value "$variable")"
  case "$value" in
    ""|*[!0-9]*)
      configuration_error "$variable must be a positive integer in PRODUCTION_ENV_FILE"
      ;;
  esac

  if [ "$value" -eq 0 ]; then
    configuration_error "$variable must be a positive integer in PRODUCTION_ENV_FILE"
  fi
done

unset auto_sync_models env_file node_env value variable
