export DOCKER_BUILDKIT=1

all: build-all scan unit-test-coverage

build-all: build build-test build-local

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

build-local:
	docker-compose build pdf-service
build-test:
	docker-compose build yarn

scan:
	trivy image --exit-code 0 --severity MEDIUM,HIGH pdf-service:latest
	trivy image --exit-code 1 --severity CRITICAL pdf-service:latest

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

VERSION ?= latest
create-manifest-version:
	docker tag pdf-service:latest-amd64 $ECR_REGISTRY/$PDF_SERVICE_ECR_REPOSITORY:$(VERSION)-amd64
	docker tag pdf-service:latest-arm64v8 $ECR_REGISTRY/$PDF_SERVICE_ECR_REPOSITORY:$(VERSION)-arm64v8
	docker push $ECR_REGISTRY/$PDF_SERVICE_ECR_REPOSITORY:$(VERSION)-amd64
	docker push $ECR_REGISTRY/$PDF_SERVICE_ECR_REPOSITORY:$(VERSION)-arm64v8
	docker manifest create $ECR_REGISTRY/$PDF_SERVICE_ECR_REPOSITORY:$(VERSION) \
		--amend $ECR_REGISTRY/$PDF_SERVICE_ECR_REPOSITORY:$(VERSION)-amd64 \
		--amend $ECR_REGISTRY/$PDF_SERVICE_ECR_REPOSITORY:$(VERSION)-arm64v8
	docker manifest push $ECR_REGISTRY/$PDF_SERVICE_ECR_REPOSITORY:$(VERSION)
