FROM alpine as base

RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      harfbuzz \
      ca-certificates \
      ttf-freefont \
      nodejs \
      yarn

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

RUN yarn add puppeteer@10.0.0

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

CMD [ "node", "-r", "esm", "src/server.js" ]

FROM base as test
RUN yarn install
COPY . .

RUN addgroup -S node && adduser -S -g node node \
    && mkdir -p /home/node/Downloads /app \
    && chown -R node:node /home/node \
    && chown -R node:node /app

ENTRYPOINT [ "yarn" ]
