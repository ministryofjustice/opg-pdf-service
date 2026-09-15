export DOCKER_BUILDKIT=1

all: build-all lint-test gosec unit-test-coverage test-image

build-all: build build-test

build:
	docker compose build pdf-service
build-test:
	docker compose build pdf-service-test

test-image: setup-directories start-service run-goss stop-service

load-test-image: setup-directories start-service run-load stop-service

start-service:
	docker compose run --rm goss
	docker compose up -d pdf-service

stop-service:
	docker compose down

run-goss:
	docker compose exec -T pdf-service /goss-bin/goss --gossfile /goss-bin/goss.yaml validate --retry-timeout 30s --format junit > test-results/junit/pdf-service-goss.xml

LOAD_PARALLELISM=14
LOAD_REQUESTS_TOTAL=200

run-load:
	yes "make send-template" | head -n $(LOAD_REQUESTS_TOTAL) | xargs -0 | parallel --jobs $(LOAD_PARALLELISM)

send-template:
	curl --silent --request POST --header "Content-Type: text/html" localhost:3004/generate-pdf --output ./test-results/load-test-pdfs/example-sirius-lpa.pdf --data-binary '@./src/baseline/example-sirius-lpa.html'

unit-test: build-test setup-directories
	docker compose run --rm pdf-service-test 'gotestsum --format testname -- ./...'

unit-test-coverage: build-test setup-directories
	docker compose run --rm pdf-service-test 'gotestsum --junitfile test-results/junit/results.xml -- -coverprofile=coverage/coverage.out -covermode=atomic ./... && go tool cover -html=coverage/coverage.out -o coverage/coverage.html'

lint-test: setup-directories
	docker compose run --rm go-lint

gosec: setup-directories
	docker compose run --rm gosec

setup-directories:
	mkdir -p -m 0777 test-results/junit coverage
	mkdir -p -m 0777 ./test-results/junit
	mkdir -p -m 0777 ./test-results/images
	mkdir -p -m 0777 ./test-results/load-test-pdfs
	mkdir -p -m 0777 ./coverage
