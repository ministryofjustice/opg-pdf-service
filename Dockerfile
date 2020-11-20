FROM buildkite/puppeteer:v3.0.4

WORKDIR /src/app
COPY package.json ./package.json
COPY yarn.lock ./yarn.lock

RUN yarn install --production
COPY . .

CMD [ "node", "-r", "esm", "src/server.js" ]
