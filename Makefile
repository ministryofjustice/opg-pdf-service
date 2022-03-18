export DOCKER_BUILDKIT=1

all: build-all scan unit-test-coverage

build-all: build build-test

build:
	${MAKE} build-amd64 build-arm64v8 -j 2

build-amd64: ARCH=amd64
build-arm64v8: ARCH=arm64v8
build-amd64 build-arm64v8:
	docker build \
		--target production \
		--tag pdf-service:latest-${ARCH} \
		--build-arg ARCH=${ARCH}/ \
		.

build-test:
	docker-compose build yarn

scan:
	${MAKE} scan-amd64 scan-arm64v8 -j 2

scan-amd64: ARCH=amd64
scan-arm64v8: ARCH=arm64v8
scan-amd64 scan-arm64v8:
	trivy image --exit-code 0 --severity MEDIUM,HIGH pdf-service:latest-${ARCH}
	trivy image --exit-code 1 --severity CRITICAL pdf-service:latest-${ARCH}

unit-test: setup-directories
	docker-compose run --rm yarn unit-test

unit-test-coverage: build-test setup-directories
	docker-compose run --rm yarn unit-test-coverage

lint-test: setup-directories
	docker-compose run --rm yarn lint:check
	docker-compose run --rm yarn jshint

setup-directories:
	mkdir -p -m 0777 ./test-results/junit
	mkdir -p -m 0777 ./coverage
