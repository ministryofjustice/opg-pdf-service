FROM alpine:3.22 AS base

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
RUN yarn install --production --ignore-scripts --frozen-lockfile

# Patch Vulnerabilities
RUN apk upgrade --no-cache busybox cups-libs curl ffmpeg-libs libcurl libcrypto3 libexpat libssl3 libwebp libxml2 mbedtls minizip sqlite-libs tiff xz-libs

COPY src src

RUN addgroup -S node && adduser -S -g node node \
    && mkdir -p /home/node/Downloads /app \
    && chown -R node:node /home/node \
    && chown -R node:node /app

RUN rm -rf /usr/local/share/.cache/yarn

USER node
CMD [ "node", "src/server.js" ]

FROM base AS test
RUN yarn install --ignore-scripts --frozen-lockfile

RUN apk add graphicsmagick ghostscript

COPY src src
COPY .jshintrc .jshintrc
COPY babel.config.cjs babel.config.cjs
COPY eslint.config.js eslint.config.js
COPY .prettierrc .prettierrc

RUN addgroup -S node && adduser -S -g node node \
    && mkdir -p /home/node/Downloads /app \
    && chown -R node:node /home/node \
    && chown -R node:node /app

USER node
ENTRYPOINT [ "yarn" ]
