FROM alpine:3.24@sha256:294b683cb724975bec92580e1e685676bd4b50bda910ddb8c51d4cabeaec77e6 AS base

RUN apk update && \
  apk add --no-cache \
    chromium \
    curl \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-liberation \
    nodejs
RUN apk add --update --no-cache npm

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser \
    XDG_CONFIG_HOME=/tmp/.config \
    XDG_CACHE_HOME=/tmp/.cache

WORKDIR /app
COPY package.json .
COPY package-lock.json .

FROM base AS production
RUN npm ci --production --ignore-scripts

# Patch Vulnerabilities
RUN apk upgrade --no-cache busybox cups-libs curl ffmpeg-libs libcurl libcrypto3 libexpat libsodium libssl3 libtasn1 libwebp libxml2 mbedtls minizip musl musl-utils sqlite-libs tiff xz-libs

COPY src src

RUN addgroup -S node && adduser -S -g node node \
    && mkdir -p /home/node/Downloads /app \
    && chown -R node:node /home/node \
    && chown -R node:node /app

USER node
CMD [ "node", "src/server.js" ]

FROM base AS test
RUN npm ci --ignore-scripts

RUN apk add graphicsmagick ghostscript

COPY src src
COPY babel.config.cjs babel.config.cjs
COPY eslint.config.js eslint.config.js
COPY .prettierrc .prettierrc

RUN addgroup -S node && adduser -S -g node node \
    && mkdir -p /home/node/Downloads /app \
    && chown -R node:node /home/node \
    && chown -R node:node /app

USER node
ENTRYPOINT [ "npm", "run" ]
