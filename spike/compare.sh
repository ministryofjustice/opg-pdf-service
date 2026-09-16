#!/usr/bin/env bash
set -euo pipefail

OUT=spike/output
mkdir -p "$OUT"

CHROMIUM_URL=${CHROMIUM_URL:-http://localhost:3004/generate-pdf}
WEASY_URL=${WEASY_URL:-http://localhost:5001/generate-pdf}

wait_for() {
  local url=$1 tries=60
  until curl -sf "$url" >/dev/null 2>&1; do
    tries=$((tries - 1))
    if [ "$tries" -le 0 ]; then
      echo "timed out waiting for $url" >&2
      exit 1
    fi
    sleep 1
  done
}

echo "Waiting for services..."
wait_for http://localhost:3004/health-check
wait_for http://localhost:5001/health-check

render() {
  local url=$1 out=$2 code
  code=$(curl -s -o "$out" -w '%{http_code}' \
    --retry 10 --retry-all-errors --retry-delay 2 --max-time 120 \
    -X POST -H 'Content-Type: text/html' --data-binary "@$f" "$url")
  if [ "$code" != "200" ]; then
    echo "  FAILED ($code) $url"
    head -c 300 "$out"; echo
    rm -f "$out"
    return 1
  fi
}

for f in src/baseline/*.html; do
  name=$(basename "$f" .html)
  echo "Rendering $name ..."
  render "$CHROMIUM_URL" "$OUT/$name.chromium.pdf" || true
  render "$WEASY_URL" "$OUT/$name.weasyprint.pdf" || true
done

echo
echo "Done. Compare in $OUT/:"
echo "  <name>.chromium.pdf  vs  <name>.weasyprint.pdf"
