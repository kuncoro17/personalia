#!/bin/sh
set -eu

app_name=${1:?APP_NAME is required}
deploy_user=${2:?Deployment user is required}
case "$app_name" in
  ''|.|..|*[!a-zA-Z0-9_.-]*) echo "Invalid APP_NAME" >&2; exit 1 ;;
esac
case "$deploy_user" in
  ''|*[!a-zA-Z0-9_.-]*) echo "Invalid deployment user" >&2; exit 1 ;;
esac

app_dir="/opt/$app_name"
echo "PREPARE: creating application directories"
sudo -n mkdir -p "$app_dir/deployment" \
  "$app_dir/backend/uploads/karyawan" "$app_dir/backend/uploads/docs"

echo "PREPARE: setting deployment directory ownership"
sudo -n chown "$deploy_user:$deploy_user" "$app_dir" "$app_dir/backend"
# Only deployment configuration needs recursive ownership for rsync --delete.
sudo -n chown -R "$deploy_user:$deploy_user" "$app_dir/deployment"

echo "PREPARE: setting upload directory ownership"
# Preserve existing files; avoid scanning all uploads on every deployment.
sudo -n chown 1001:1001 "$app_dir/backend/uploads" \
  "$app_dir/backend/uploads/karyawan" "$app_dir/backend/uploads/docs"
echo "PREPARE: completed"
