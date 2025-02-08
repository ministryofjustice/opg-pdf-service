FROM alpine:3.21 AS base

RUN apk add --no-cache \
    chromium \
    curl \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-liberation \
    nodejs \
    yarn

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /app
COPY package.json ./package.json
COPY yarn.lock ./yarn.lock

FROM base AS production
RUN yarn install --production
COPY src src

RUN addgroup -S node && adduser -S -g node node \
    && mkdir -p /home/node/Downloads /app \
    && chown -R node:node /home/node \
    && chown -R node:node /app
# Patch Vulnerabilities
RUN apk upgrade --no-cache busybox cups-libs curl ffmpeg-libs libcurl libcrypto3 libssl3 libwebp libxml2 minizip
USER node
CMD [ "node", "src/server.js" ]

FROM base AS test
RUN yarn install
COPY src src
COPY .jshintrc .jshintrc
COPY babel.config.cjs babel.config.cjs
COPY eslint.config.js eslint.config.js
COPY .prettierrc .prettierrc

RUN apk add graphicsmagick ghostscript

RUN addgroup -S node && adduser -S -g node node \
    && mkdir -p /home/node/Downloads /app \
    && chown -R node:node /home/node \
    && chown -R node:node /app
USER node
ENTRYPOINT [ "yarn" ]
