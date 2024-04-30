export DOCKER_BUILDKIT=1

all: build-all scan lint-test unit-test-coverage test-image

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
		--no-cache \
		.

build-local:
	docker compose build pdf-service
build-test:
	docker compose build pdf-service-test

test-image: setup-directories start-container run-inspec stop-container

load-test-image: setup-directories start-container run-load stop-container

start-container:
	docker run --cpus=0.5 --memory=1G -p 8000:80 --rm -d --name pdf-service pdf-service:latest-amd64
	sleep 8

stop-container:
	docker container kill pdf-service

run-inspec:
	inspec exec inspec -t docker://pdf-service --reporter cli junit:test-results/junit/pdf-service-inspec.xml

LOAD_PARALLELISM=18
LOAD_REQUESTS_TOTAL=200

run-load:
	yes "make send-template" | head -n $(LOAD_REQUESTS_TOTAL) | xargs -0 | parallel --jobs $(LOAD_PARALLELISM)

send-template:
	curl --silent --request POST --header "Content-Type: text/html" localhost:8000/generate-pdf --output ./test-results/load-test-pdfs/example-sirius-lpa.pdf --data-binary '@./src/baseline/example-sirius-lpa.html'

unit-test: setup-directories
	docker compose run --rm pdf-service-test unit-test

unit-test-coverage: build-test setup-directories
	docker compose run --rm pdf-service-test unit-test-coverage

lint-test: setup-directories
	docker compose run --rm pdf-service-test lint:check
	docker compose run --rm pdf-service-test jshint

setup-directories:
	mkdir -p -m 0777 test-results/junit .trivy-cache coverage
	mkdir -p -m 0777 ./test-results/junit
	mkdir -p -m 0777 ./test-results/images
	mkdir -p -m 0777 ./test-results/load-test-pdfs
	mkdir -p -m 0777 ./coverage

VERSION ?= latest
create-manifest-version:
	docker tag pdf-service:latest-amd64 $(ECR_REGISTRY)/$(PDF_SERVICE_ECR_REPOSITORY):$(VERSION)-amd64
	docker tag pdf-service:latest-arm64v8 $(ECR_REGISTRY)/$(PDF_SERVICE_ECR_REPOSITORY):$(VERSION)-arm64v8
	docker push $(ECR_REGISTRY)/$(PDF_SERVICE_ECR_REPOSITORY):$(VERSION)-amd64
	docker push $(ECR_REGISTRY)/$(PDF_SERVICE_ECR_REPOSITORY):$(VERSION)-arm64v8
	docker manifest create $(ECR_REGISTRY)/$(PDF_SERVICE_ECR_REPOSITORY):$(VERSION) \
		--amend $(ECR_REGISTRY)/$(PDF_SERVICE_ECR_REPOSITORY):$(VERSION)-amd64 \
		--amend $(ECR_REGISTRY)/$(PDF_SERVICE_ECR_REPOSITORY):$(VERSION)-arm64v8
	docker manifest push $(ECR_REGISTRY)/$(PDF_SERVICE_ECR_REPOSITORY):$(VERSION)

scan: setup-directories
	docker compose run --rm trivy image --format table --exit-code 0 pdf-service:latest-amd64
	docker compose run --rm trivy image --format sarif --output /test-results/trivy.sarif --exit-code 1 pdf-service:latest-amd64
