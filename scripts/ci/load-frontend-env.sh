#!/bin/sh

set -eu

: "${FRONTEND_ENV_FILE:?FRONTEND_ENV_FILE is required}"
: "${FRONTEND_API_DOMAIN:?FRONTEND_API_DOMAIN is required}"
: "${FRONTEND_ENV_LABEL:=FRONTEND_ENV_FILE}"

if [ ! -s "$FRONTEND_ENV_FILE" ]; then
  echo "$FRONTEND_ENV_LABEL is missing or empty"
  return 1
fi

invalid_key="$(awk -F= '
  /^[[:space:]]*($|#)/ { next }
  $1 !~ /^(VITE_API_URL|VITE_CLERK_PUBLISHABLE_KEY|VITE_CLERK_SIGN_IN_URL|VITE_CLERK_DOMAIN|VITE_CLERK_IS_SATELLITE|VITE_SAS_PORTAL_URL|VITE_SAS_SDM_URL)$/ { print $1; exit }
' "$FRONTEND_ENV_FILE")"

if [ -n "$invalid_key" ]; then
  echo "Unsupported key in $FRONTEND_ENV_LABEL: $invalid_key"
  return 1
fi

for variable in \
  VITE_API_URL \
  VITE_CLERK_PUBLISHABLE_KEY \
  VITE_CLERK_SIGN_IN_URL \
  VITE_CLERK_DOMAIN \
  VITE_CLERK_IS_SATELLITE \
  VITE_SAS_SDM_URL; do
  value="$(awk -v key="$variable" '
    index($0, key "=") == 1 {
      sub(/^[^=]*=/, "")
      sub(/\r$/, "")
      print
      found=1
      exit
    }
    END { if (!found) exit 1 }
  ' "$FRONTEND_ENV_FILE")" || {
    echo "$variable is missing from $FRONTEND_ENV_LABEL"
    return 1
  }

  if [ -z "$value" ] || [ "$value" = "change this" ]; then
    echo "$variable is not configured in $FRONTEND_ENV_LABEL"
    return 1
  fi

  export "$variable=$value"
done

VITE_SAS_PORTAL_URL="$(awk -v key="VITE_SAS_PORTAL_URL" '
  index($0, key "=") == 1 {
    sub(/^[^=]*=/, "")
    sub(/\r$/, "")
    print
    found=1
    exit
  }
  END { if (!found) exit 1 }
' "$FRONTEND_ENV_FILE" 2>/dev/null || true)"

if [ -z "$VITE_SAS_PORTAL_URL" ]; then
  VITE_SAS_PORTAL_URL="$VITE_CLERK_SIGN_IN_URL"
fi

export VITE_SAS_PORTAL_URL

# Reject placeholders before they are embedded permanently in the Vite bundle.
# This checks the key's format, not whether the Clerk instance is configured.
if ! printf '%s\n' "$VITE_CLERK_PUBLISHABLE_KEY" | LC_ALL=C grep -Eq '^pk_(test|live)_[A-Za-z0-9+/]+={0,2}$'; then
  echo "VITE_CLERK_PUBLISHABLE_KEY in $FRONTEND_ENV_LABEL must be a Clerk publishable key (pk_test_... or pk_live_...)"
  return 1
fi

if [ "$VITE_CLERK_IS_SATELLITE" != "true" ] && [ "$VITE_CLERK_IS_SATELLITE" != "false" ]; then
  echo "VITE_CLERK_IS_SATELLITE in $FRONTEND_ENV_LABEL must be true or false"
  return 1
fi

if [ "$VITE_CLERK_IS_SATELLITE" = "true" ]; then
  if printf '%s\n' "$VITE_CLERK_DOMAIN" | LC_ALL=C grep -Eq '(^https?://|/|,|[[:space:]])'; then
    echo "VITE_CLERK_DOMAIN in $FRONTEND_ENV_LABEL must be a single hostname, for example bpkpenabur.or.id"
    return 1
  fi

  if ! printf '%s\n' "$VITE_CLERK_SIGN_IN_URL" | LC_ALL=C grep -Eq '^https://[^,[:space:]]+/?([^,[:space:]]*)?$'; then
    echo "VITE_CLERK_SIGN_IN_URL in $FRONTEND_ENV_LABEL must be one HTTPS URL, for example https://sas.bpkpenabur.or.id/"
    return 1
  fi
fi

case "$FRONTEND_API_DOMAIN" in
  http://*|https://*) expected_api_url="${FRONTEND_API_DOMAIN%/}" ;;
  *) expected_api_url="https://${FRONTEND_API_DOMAIN%/}" ;;
esac

if [ "${VITE_API_URL%/}" != "$expected_api_url" ]; then
  echo "VITE_API_URL in $FRONTEND_ENV_LABEL does not match its API domain"
  return 1
fi

unset invalid_key value variable expected_api_url
