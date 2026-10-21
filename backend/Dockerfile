# Laravel API on PHP-FPM. Used by the `app` and `scheduler` services in docker-compose.yml.

# ---------- dependencies ----------
FROM composer:2 AS vendor
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader --no-interaction --prefer-dist --ignore-platform-reqs
COPY . .
RUN composer dump-autoload --no-dev --optimize --no-scripts

# ---------- runtime ----------
FROM php:8.4-fpm-alpine

# pdo_sqlite, mbstring, openssl, fileinfo, etc. ship with the base image; only opcache is added.
RUN docker-php-ext-install opcache \
    && mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"
COPY docker/php.ini "$PHP_INI_DIR/conf.d/zz-app.ini"
COPY --chmod=755 docker/entrypoint.sh /usr/local/bin/entrypoint

WORKDIR /var/www/html
COPY --from=vendor --chown=www-data:www-data /app /var/www/html

# /data holds the SQLite database and the generated APP_KEY (a volume in compose).
RUN mkdir -p /data bootstrap/cache storage/app/public storage/framework/cache/data storage/framework/sessions storage/framework/views storage/logs \
    && chown -R www-data:www-data /data bootstrap/cache storage

USER www-data
ENV APP_ENV=production \
    APP_DEBUG=false \
    DB_CONNECTION=sqlite \
    DB_DATABASE=/data/database.sqlite \
    LOG_CHANNEL=stderr \
    SESSION_DRIVER=file \
    CACHE_STORE=file \
    QUEUE_CONNECTION=sync

# Builds bootstrap/cache/packages.php for the production (no-dev) package set.
RUN php artisan package:discover --ansi

EXPOSE 9000
ENTRYPOINT ["entrypoint"]
CMD ["php-fpm"]
