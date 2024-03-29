ARG ARCH=
FROM ${ARCH}alpine:3.19 as base

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

FROM base as production
RUN yarn install --production
COPY . .

RUN addgroup -S node && adduser -S -g node node \
    && mkdir -p /home/node/Downloads /app \
    && chown -R node:node /home/node \
    && chown -R node:node /app
# Patch Vulnerabilities
RUN apk upgrade --no-cache cups-libs ffmpeg-libs libcrypto3 libssl3 libwebp libxml2 minizip
USER node
CMD [ "node", "src/server.js" ]

FROM base as test
RUN yarn install
COPY . .
RUN apk add graphicsmagick ghostscript

RUN addgroup -S node && adduser -S -g node node \
    && mkdir -p /home/node/Downloads /app \
    && chown -R node:node /home/node \
    && chown -R node:node /app
USER node
ENTRYPOINT [ "yarn" ]
