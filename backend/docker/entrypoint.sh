#!/bin/sh
# Prepares Laravel before starting the container command.
# The `app` service (php-fpm) also migrates and seeds; the scheduler only needs config.
set -e

# Use APP_KEY from the environment, or generate one on first start and keep it in /data.
if [ -z "$APP_KEY" ]; then
  if [ ! -s /data/app_key ]; then
    php -r 'echo "base64:".base64_encode(random_bytes(32));' > /data/app_key
    echo "entrypoint: generated APP_KEY in /data/app_key"
  fi
  APP_KEY="$(cat /data/app_key)"
  export APP_KEY
fi

php artisan config:cache --no-ansi

if [ "$1" = "php-fpm" ]; then
  rm -f /tmp/ready
  [ -f "$DB_DATABASE" ] || touch "$DB_DATABASE"
  php artisan migrate --force --no-ansi
  # database/data/*.json is the source of truth for portfolio content, so re-seed on every start.
  # Contact messages and GitHub stars are kept.
  if [ "${SEED_ON_START:-true}" = "true" ]; then
    php artisan db:seed --force --no-ansi
  fi
  touch /tmp/ready
fi

exec "$@"
