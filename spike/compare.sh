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

for f in src/baseline/*.html; do
  name=$(basename "$f" .html)
  echo "Rendering $name ..."
  curl -sf -X POST -H 'Content-Type: text/html' --data-binary "@$f" "$CHROMIUM_URL" \
    -o "$OUT/$name.chromium.pdf" || echo "  chromium render failed for $name"
  curl -sf -X POST -H 'Content-Type: text/html' --data-binary "@$f" "$WEASY_URL" \
    -o "$OUT/$name.weasyprint.pdf" || echo "  weasyprint render failed for $name"
done

echo "Rasterising PDFs to PNG (via poppler in the weasyprint container)..."
docker compose exec -T weasyprint sh -c \
  'for p in /output/*.pdf; do [ -e "$p" ] || continue; pdftoppm -png -r 100 -singlefile "$p" "${p%.pdf}"; done'

echo
echo "Done. Compare in $OUT/:"
echo "  <name>.chromium.png  vs  <name>.weasyprint.png"
