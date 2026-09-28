#!/bin/sh
# Remove only this application's old image tags. Never prune volumes or other apps.
set -eu
: "${ALIYUN_REGISTRY:?ALIYUN_REGISTRY is required}"
prefix="$ALIYUN_REGISTRY/fyuo-blog"
repos="blog-backend blog-frontend blog-mcp-publisher"

# A rollback release must have all three images available locally.
complete_tags=$(
  docker image ls "$prefix/blog-backend" --format '{{.Tag}}' |
  grep -E '^v[0-9]+\.[0-9]+\.[0-9]+$' | sort -Vr |
  while IFS= read -r tag; do
    complete=true
    for repo in $repos; do
      docker image inspect "$prefix/$repo:$tag" >/dev/null 2>&1 || complete=false
    done
    if [ "$complete" = true ]; then printf '%s\n' "$tag"; fi
  done
)
keep_tags=$(printf '%s\n' "$complete_tags" | head -n 2)
if [ "$(printf '%s\n' "$keep_tags" | grep -c '^v')" -lt 2 ]; then
  echo 'Cleanup skipped: fewer than two complete releases are available.'
  exit 0
fi

# Protect running containers, including a deliberate rollback to an older tag.
running=$(docker ps -a --format '{{.Image}}')
echo "Keeping releases: $keep_tags"
for repo in $repos; do
  docker image ls "$prefix/$repo" --format '{{.Repository}}:{{.Tag}}' |
  while IFS= read -r ref; do
    tag=${ref##*:}
    if printf '%s\n' "$keep_tags" | grep -Fxq "$tag"; then continue; fi
    if printf '%s\n' "$running" | grep -Fxq "$ref"; then
      echo "Keeping container image: $ref"
      continue
    fi
    docker image rm "$ref"
  done
done
