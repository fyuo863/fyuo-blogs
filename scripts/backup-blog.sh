#!/bin/sh
set -eu
umask 077
exec 9>/var/lock/fyuo-backup.lock
flock -n 9 || exit 1
test -s /data/blog/backup-recipient.pem
openssl x509 -in /data/blog/backup-recipient.pem -noout >/dev/null
out=/data/blog-backups
mkdir -p "$out"
work=$(mktemp -d /var/tmp/fyuo-backup.XXXXXX)
mkdir "$work/data"
paused=''
cleanup() {
 for c in $paused; do docker unpause "$c" >/dev/null 2>&1 || true; done
 rm -rf -- "$work"
}
trap cleanup EXIT HUP INT TERM
# Freeze writers briefly so database records and ZIP/image files agree.
for c in blog-backend blog-ai-coding-ai-coding-sync-1; do
 docker pause "$c" >/dev/null
 paused="$paused $c"
done
timeout 90 docker exec blog_postgres sh -c 'pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" -Fc' >"$work/data/database.dump"
for volume in blog_backend_plugins blog_backend_uploads blog-ai-coding_snapshots; do
 source=$(docker volume inspect -f '{{.Mountpoint}}' "$volume")
 tar -C "$source" -czf "$work/data/$volume.tgz" .
done
cp /data/blog/.env "$work/data/server.env"
cp /data/blog/.release "$work/data/release"
for c in $paused; do docker unpause "$c" >/dev/null; done
paused=''
name="blog-$(date -u +%Y%m%dT%H%M%SZ).tar.cms"
tar -C "$work/data" -cf "$work/archive.tar" .
openssl cms -encrypt -binary -aes-256-cbc -outform DER -in "$work/archive.tar" \
 -out "$out/$name.partial" /data/blog/backup-recipient.pem
rm -f "$work/archive.tar"
mv "$out/$name.partial" "$out/$name"
sha256sum "$out/$name" >"$out/$name.sha256"
touch "$out/last-success"
find "$out" -maxdepth 1 -type f -name 'blog-*.tar.cms*' -mtime +14 -delete
printf '%s\n' "$name"
