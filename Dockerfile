# Build the static Go binary.
FROM golang:1.26-alpine AS build
WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -trimpath -o /pdf-service ./cmd/pdf-service

FROM chromedp/headless-shell:latest AS production
RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates fonts-liberation \
    # Patch Vulnerable Packages
    && apt-get install -y --only-upgrade perl-base libc-bin libc6 libpcre2-8-0 gzip libsqlite3-0 socat libexpat1 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN groupadd --gid 65532 app-user \
    && useradd --uid 65532 --gid 65532 --home-dir /nonexistent --no-create-home --shell /sbin/nologin app-user

ENV PDF_CHROME_PATH=/headless-shell/headless-shell \
    HOME=/tmp \
    XDG_CONFIG_HOME=/tmp/.config \
    XDG_CACHE_HOME=/tmp/.cache

COPY --from=build /pdf-service /usr/local/bin/pdf-service
USER app-user
EXPOSE 80
ENTRYPOINT ["/usr/local/bin/pdf-service"]

FROM golang:1.26 AS test
RUN apt-get update \
    && apt-get install -y --no-install-recommends chromium ca-certificates fonts-liberation \
    && rm -rf /var/lib/apt/lists/*
ENV PDF_CHROME_PATH=/usr/bin/chromium \
    CGO_ENABLED=0
WORKDIR /app
RUN go install gotest.tools/gotestsum@latest
COPY go.mod go.sum ./
RUN go mod download
COPY . .
ENTRYPOINT ["sh", "-c"]
