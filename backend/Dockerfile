FROM php:8.4-cli

# Install system dependencies & PHP extensions required by Laravel
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libzip-dev \
    && docker-php-ext-install pdo pdo_mysql zip \
    && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Copy application files
COPY . .

# Ensure Laravel storage & cache directories exist and are writable
RUN mkdir -p storage/framework/sessions \
    storage/framework/views \
    storage/framework/cache/data \
    storage/app/public/posts \
    bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# Install Composer dependencies without running scripts that require .env yet
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-scripts

EXPOSE 8000

CMD sh -c "php artisan package:discover --ansi && php artisan migrate --seed --force && php artisan storage:link --force && php artisan serve --host=0.0.0.0 --port=${PORT:-8000}"

