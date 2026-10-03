#!/bin/sh
set -eu
# Older releases mounted Redis at /var/lib/redis/data while Redis wrote /data.
# Stop the writer, save the live snapshot and migrate it before recreation.
# On failure, restart the existing backend; leave it stopped on success until up.
if docker inspect blog_redis >/dev/null 2>&1; then
  redis_mount=$(docker inspect -f '{{range .Mounts}}{{if eq .Destination "/data"}}{{.Name}}{{end}}{{end}}' blog_redis)
  if [ "$redis_mount" != blog_redis_data ]; then
    work=$(mktemp -d)
    stopped=0
    cleanup() {
      result=$?
      if [ "$result" -ne 0 ] && [ "$stopped" = 1 ]; then docker start blog-backend >/dev/null || true; fi
      rm -rf -- "$work"
    }
    trap cleanup EXIT
    docker compose stop backend
    stopped=1
    docker exec blog_redis redis-cli SAVE
    docker cp blog_redis:/data/dump.rdb "$work/dump.rdb"
    redis_image=$(docker compose config --images | grep '/redis:' | head -1)
    test -n "$redis_image"
    docker run --rm --network none --memory 64m --user 0:0 --entrypoint sh \
      -v blog_redis_data:/data -v "$work:/snapshot:ro" "$redis_image" \
      -c 'cp /snapshot/dump.rdb /data/dump.rdb && chown -R redis:redis /data'
  fi
fi
# Data contents, names and database rows are unchanged. Existing root-owned
# volumes need one ownership migration before starting the non-root backend.
for volume in blog_backend_uploads blog_backend_plugins; do
  docker volume inspect "$volume" >/dev/null
  docker run --rm --network none --user 0:0 --entrypoint sh \
    -v "$volume:/data" "$(docker compose images -q backend | head -1)" \
    -c 'chown -R 10001:10001 /data'
done
