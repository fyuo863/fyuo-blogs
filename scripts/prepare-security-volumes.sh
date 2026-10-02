#!/bin/sh
set -eu
# Data contents, names and database rows are unchanged. Existing root-owned
# volumes need one ownership migration before starting the non-root backend.
for volume in blog_backend_uploads blog_backend_plugins; do
  docker volume inspect "$volume" >/dev/null
  docker run --rm --network none --user 0:0 --entrypoint sh \
    -v "$volume:/data" "$(docker compose images -q backend | head -1)" \
    -c 'chown -R 10001:10001 /data'
done
