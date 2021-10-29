FROM buildkite/puppeteer:10.0.0

WORKDIR /src/app
COPY package.json ./package.json
COPY yarn.lock ./yarn.lock

RUN yarn install --production
COPY . .

RUN chown -R www-data /src
USER www-data

CMD [ "node", "-r", "esm", "src/server.js" ]
