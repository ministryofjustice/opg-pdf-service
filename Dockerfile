FROM buildkite/puppeteer:10.0.0

WORKDIR /src/app
COPY package.json ./package.json
COPY yarn.lock ./yarn.lock

RUN yarn install --production
COPY . .

CMD [ "node", "-r", "esm", "src/server.js" ]
