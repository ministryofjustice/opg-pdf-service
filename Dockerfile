ARG ARCH=
FROM ${ARCH}alpine as base

RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      harfbuzz \
      ca-certificates \
      ttf-liberation \
      nodejs \
      yarn

RUN apk update && \
    apk upgrade busybox --repository=http://dl-cdn.alpinelinux.org/alpine/edge/main && \
    apk upgrade \
    libssl1.1 \
    libcrypto1.1 && \
    rm -rf /var/cache/apk/*

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
USER node
CMD [ "node", "-r", "esm", "src/server.js" ]

FROM base as test
RUN yarn install
COPY . .

RUN addgroup -S node && adduser -S -g node node \
    && mkdir -p /home/node/Downloads /app \
    && chown -R node:node /home/node \
    && chown -R node:node /app
USER node
ENTRYPOINT [ "yarn" ]
