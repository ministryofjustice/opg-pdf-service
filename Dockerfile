FROM node:24-alpine AS base

RUN apk update && \
  apk add --no-cache chromium \
    ttf-liberation

RUN npm install -g npm@12.1.0

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

USER node
CMD [ "node", "src/server.js" ]

FROM base AS test
RUN npm ci --ignore-scripts

RUN apk add graphicsmagick ghostscript

COPY src src
COPY babel.config.cjs babel.config.cjs
COPY eslint.config.js eslint.config.js
COPY .prettierrc .prettierrc

USER node
ENTRYPOINT [ "npm", "run" ]
