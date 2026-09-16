#!/bin/sh
# Restart contract for the preview. Idempotent: healthy :8080 exits 0;
# otherwise start the Vite dev server via npm run dev.
set -eu
if curl -sf -o /dev/null --max-time 2 http://127.0.0.1:8080/; then
  exit 0
fi
cd /workspace
npm run dev > /tmp/hp-dev.log 2>&1 &
# Wait briefly for bind without blocking revive for long.
i=0
while [ "$i" -lt 40 ]; do
  if curl -sf -o /dev/null --max-time 1 http://127.0.0.1:8080/; then
    exit 0
  fi
  i=$((i + 1))
  sleep 0.25
done
exit 0
