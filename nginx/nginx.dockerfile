FROM nginx:1.21.1 AS nginx-base

RUN set -x \
    && apt-get update \
    && apt-get install --no-install-recommends --no-install-suggests -y man nano procps ca-certificates wget gnupg gnupg2 iputils-ping net-tools supervisor \
    && apt-get clean autoclean \
    && apt-get autoremove --yes \
    && rm -rf /var/lib/{apt,dpkg,cache,log}/

EXPOSE  80 443

WORKDIR /var/www

COPY config/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
CMD ["service supervisor restart"]

FROM nginx-base AS nginx-config

# Replace the original Nginx config file
COPY config/nginx.conf /etc/nginx/nginx.conf

# Test HTML file
COPY scripts/index.html /var/www/html/index.html