# Visitor cache and event pipeline

## Semantics and rollout boundary

The content cache is enabled by this change. The Stream pipeline is **opt-in** via
`VISIT_STREAM_ENABLED=true`, after an explicit baseline migration. Never mix old
and new counter writers during a rollout. No production deployment or historical
production data modification was performed for this change.

PV means one article open/selection. It does not mean unique IP, UV, a render, or
a successfully loaded static asset. Returning to the list and reopening creates
a new PV. React rerenders and at most three network attempts reuse one event ID.
The article remains displayed if statistics fail.

`POST /api/v1/articles/:id/view` remains compatible with clients expecting HTTP
200 and `view_count`/`like_count`. Modern clients send `X-Event-Id` in the form
`<13-digit Unix milliseconds>-<32 lowercase hex characters>`, and optionally
`X-Visitor-Id` (at most 80 bytes). The server derives time from the event ID,
validates a ten-minute past / one-minute future window, and checks article
visibility. IP comes from the connection; trusted proxy headers are disabled by
default. Configure explicit trusted proxies before using client-IP limits behind
a reverse proxy; do not trust arbitrary `X-Forwarded-For`.

An absent event ID gets a server-generated ID for legacy compatibility. Such a
legacy client cannot make response-loss retries idempotent. The frontend sends
IDs, and retries only network/429/5xx errors with 500 ms and 1,000 ms delays.
Anonymous visitor labels are fingerprints, **not UV identifiers**.

Successful responses include `accepted: true`, `event_id`, `duplicate`, and
`persisted: false`: success confirms Redis acceptance, not PostgreSQL commit.
Queue full/unavailable returns 503; rate limits return 429, with `Retry-After`.
A transport error may occur after Redis committed, so error responses distinguish
`acceptance: unknown` from known rejection. Retry the same event ID, never mint a
new ID to resolve an ambiguous response.

## Content cache and visibility

- `blog:v2:content:<Redis run_id>:<epoch>:blogs:page:<p>:size:<s>` stores list JSON.
- `blog:v2:content:<Redis run_id>:<epoch>:article:<id>` stores detail JSON and also
  serves as the article-validity entry. JSON `null` represents missing/hidden.
- Normal TTL is 45–74 seconds; negative TTL is 3–5 seconds. No permanent homepage
  cache is used. Administrator mutations synchronously warm the first page after
  invalidation. Counts are overlaid from independent Redis keys after decoding;
  the stored article only carries a SQL snapshot as a degraded-read fallback.
- Singleflight shares immutable JSON, with at most 256 waiting/read requests and
  8 concurrent origin loads per process. Saturation is an immediate 503, not an
  unbounded goroutine or SQL wait queue. Cache probes have a 150 ms budget and SQL
  reads a three-second budget, allowing useful SQL fallback when Redis is down.
- All existing administrator/MCP article writes go through the ArticleService.
  A persistent `blog:v2:writer` barrier is acquired before mutation. While it is
  held, readers bypass Redis content and use bounded SQL. After the repository's
  transaction commits, an atomic Lua operation rotates `blog:v2:epoch` and removes
  the barrier. Concurrent fills into an old generation cannot become current.
- Ordinary edits have the same boundary as hiding/deletion: requests that started
  before the change may finish with their old snapshot; subsequent requests do
  not select the old generation. Existing visibility semantics remain
  `stage != hidden`; this is not a new draft/private-article permission system.
- Redis `run_id` participates in the namespace. Restart/failover cannot resurrect
  old cached content from a persisted epoch. Failure to read this identity disables
  caching. Redis ACLs must allow `INFO server` as well as the cache commands.
- The barrier has no expiring lease that could release a stalled writer. A crash
  may leave caching disabled and future edits returning busy. Inspect the error
  log, stop all writers, ensure no database mutation remains in flight, then rotate
  the epoch and delete the barrier atomically. Never just delete it while writers
  run. Direct SQL changes to visibility must follow this same maintenance procedure.

```text
EVAL "redis.call('SET',KEYS[1],ARGV[1]);return redis.call('DEL',KEYS[2])" 2 blog:v2:epoch blog:v2:writer <new-random-epoch>
```

## Admission, persistence and recovery

`blog:visits:v2` has exactly one application consumer group, `postgres-v2`.
Admission Lua validates **all key types and numeric values before any mutation**,
checks maintenance/boot state, checks duplicate binding to the article, queue
capacity, and visitor-plus-IP and generous aggregate-IP minute limits. It then
XADDs the event before installing dedup/count/limiter values. It never uses MAXLEN.
`XLEN` includes unread and Pending work, so claiming does not create free capacity.
Wrong types, invalid numeric values and full/Pending queues are tested. Lua is
not rollback-capable: external ACL changes, destructive key edits, Redis crashes
and storage errors remain operational hazards. Use a dedicated namespace, stable
ACLs, `noeviction`, and a memory limit sized for queue **and** dedup retention.

Live views use `blog:views:v2:<article_id>`, without expiration. Dedup keys last
20 minutes, longer than the accepted event-age window. A missing counter or changed
Redis boot identity fences admission and triggers reconstruction from PostgreSQL
once queued work drains. This rebuild restores recent durable event IDs in batches
of 1,000 before marking the current boot ready. It prevents a persisted event retry
from becoming a fresh count after Redis loss. Recovery can temporarily return 503.
A crashed reconciliation may leave `blog:visits:maintenance`; inspect and drain
with consumers before releasing it under an offline maintenance procedure.

Each fixed worker batches XREADGROUP / XAUTOCLAIM. A PostgreSQL transaction:

1. Takes a batch-level advisory lock to give article increments a consistent order.
2. Inserts unique `event_id` ledger entries with `ON CONFLICT DO NOTHING`.
3. Writes visit records only for new events and existing articles.
4. Adds the new-event counts to article rows, then commits.

ACK and XDEL happen atomically **after** commit. A crash between commit and ACK
replays against the ledger and cannot double count. Duplicate IDs within a batch
are also collapsed. An article hidden after acceptance still receives its accepted
PV; a physically deleted article retains its event ledger entry but gets no article
increment or dangling access record. Audit these with a ledger-to-article left join.
The current API's delete operation hides articles, rather than physically removing
them. City is left empty in the asynchronous record; no remote geo lookup runs in
the admission path or database transaction.

Infrastructure failures stay Pending with exponential backoff capped at 30 seconds.
They are never discarded just because a database outage lasted too long. Malformed
events are saved to `visit_failures` before ACK. Permanent SQL data/constraint
errors have a finite redelivery budget, then the complete affected source messages
are saved there. Repair/export failures before their retention expires; inspect
`stream_id`, `payload`, `reason`, `created_at`. Failed batches are not falsely
reported as persisted. Live counts are provisional until recovery/reconciliation.

Processed Stream entries are deleted immediately after ACK. Recent Redis dedup
keys expire after 20 minutes. During idle periods only, bounded maintenance removes
at most 1,000 rows per table per minute: event ledger older than 7 days, visit
records older than 90 days, failures older than 30 days. It refuses cleanup while
any queued/Pending work exists and fences admission during cleanup. Continuous
load/outage can defer retention; monitor storage and schedule an idle drain window.
It is preferable to retain extra data rather than expire the ledger of pending work.

Redis AOF `appendfsync everysec` normally leaves roughly a one-second crash-loss
window; OS/storage failures can extend it. An HTTP-accepted event not yet committed
to PostgreSQL can be lost with Redis data. There is **no zero-loss guarantee**.
Committed events survive Redis loss and are protected by the PostgreSQL ledger.
Do not restore an old PostgreSQL backup underneath a live newer Redis queue without
an explicit reconciliation plan. Redis backups older than the retained SQL ledger
 must not be replayed directly: preserve/restore the matching ledger or audit those
 messages offline before admitting traffic. Likes retain their original Redis toggle and
periodic SQL flush behavior, including that mechanism's existing durability window.

## Configuration and observability

Viper now uses `mapstructure` database tags and a fresh Viper instance per load.
Defaults/example values: maximum 24 open / 8 idle database connections, 300-second
lifetime, 60-second idle lifetime, 3-second statement timeout, 3-second connect
timeout. A regression test first reproduced all three old pool fields decoding to
zero. Startup logs actual pool settings, never a DSN/password. Request shutdown
stops admission, joins fixed workers/scheduler, then closes PostgreSQL and Redis.
Set the container stop grace period to at least 20 seconds (the Stream benchmark
override does this). A previously configured one-second Docker stop timeout can
SIGKILL the process before its bounded final sync completes.

| Environment | Default | Meaning |
|---|---:|---|
| VISIT_STREAM_ENABLED | false | Requires baseline marker |
| VISIT_WORKERS | 2 | 1–16 workers/process |
| VISIT_BATCH | 100 | 1–1,000 events/read and transaction |
| VISIT_CAPACITY | 50000 | Global stream entry capacity |
| VISIT_BLOCK | 1s | Blocking read timeout |
| VISIT_CLAIM_IDLE | 30s | Pending re-claim idle threshold |
| VISIT_BACKOFF | 1s | Initial infrastructure backoff; max 30s |
| VISIT_MAX_RETRIES | 5 | Permanent SQL error redelivery budget |
| VISIT_RATE | 60 | Visitor + IP requests/minute |
| VISIT_IP_RATE | 10000 | Shared-exit IP ceiling/minute |

Every 15 seconds, structured logs report backlog, oldest Stream event age, Pending,
process-local accepted/duplicate/persisted/failure/dead totals, cache hits/misses,
origin rejections and `sql.DB.Stats()` (open/in-use/idle/wait count/wait duration).
Counters reset on process restart; the ledger is the durable audit source.
Minute-window limits permit a boundary burst. Anonymous clients can rotate visitor
IDs; the IP ceiling and global queue capacity remain the additional bounds.

## Reproducible isolated commands

Use PowerShell at the repository root. These Compose files use disposable fixed
credentials, loopback ports and separate projects, without production `.env`.

```powershell
docker compose -f bench/compose.verify.yaml up -d --wait
Push-Location backend
$env:BLOG_VISITOR_INTEGRATION='1'
go test ./...
go test -race ./internal/service ./internal/config
Remove-Item Env:BLOG_VISITOR_INTEGRATION
Pop-Location
node --test frontend/src/view-events.test.js bench/run.test.mjs
npm --prefix frontend run build
```

Integration tests create and drop their own PostgreSQL schemas in `bench`, using
port 15439 and Redis DB 15 on port 16389. They deliberately flush only that test DB.
Never point these tests at another Redis/PostgreSQL service.

For a fresh benchmark stack, follow `bench/README.md` to seed 1,000 synthetic
articles with the old code first. Then, with all old writers stopped:

```powershell
node bench/enable-streams.mjs              # stops test backend; writes reviewable SQL
node bench/enable-streams.mjs --apply      # marker makes reruns a no-op
Push-Location backend
$env:GOOS='linux'; $env:GOARCH='amd64'; $env:CGO_ENABLED='0'
go build -o ../bench/backend-linux ./main.go
Remove-Item Env:GOOS,Env:GOARCH,Env:CGO_ENABLED
Pop-Location
docker compose -f bench/compose.yaml -f bench/compose.local.yaml -f bench/compose.streams.yaml up -d --build --wait
$env:VISITOR_STREAM='1'; node bench/visitor.mjs
Remove-Item Env:VISITOR_STREAM
node bench/resilience.mjs
```

`bench/Dockerfile.local` requires the existing cached `blog-backend:local` runtime;
otherwise use the normal `backend/Dockerfile` Compose build. Bench rate limits are
raised explicitly because all synthetic clients share one IP; real limits are
separately tested against real Redis. Reports preserve each repetition and failure.
`resilience.mjs` stops/restarts **only** the isolated benchmark services.

The schema migration is `backend/migrations/001_visit_events.sql`: additive,
idempotent and does not modify history. Production baseline preparation must be
reviewed independently: stop **all** legacy writers/schedulers, snapshot current
Redis absolute views/likes and PostgreSQL counts, investigate any contradictory
baseline, apply the chosen baseline in a transaction, and write `stream-v2` to
`visit_migrations` exactly once. Do not rerun historical absolute-count updates
after new events exist. The provided automation is intentionally isolated-only.

Rollback: stop admission, keep consumers running until XLEN and Pending are zero,
verify ledger/count deltas, stop all workers, snapshot PostgreSQL absolute counts
into the legacy Redis counter keys, and remove/rename the active migration marker
in a reviewed transaction. Restore the old frontend retry behavior together with
the old server. Never enable the old absolute-value scheduler against stale legacy
keys. Keep the new ledger/failure tables for auditing. Merely setting the feature
flag false is refused while the marker exists. `snapshot-legacy.mjs` demonstrates
the isolated counter-export step without changing PostgreSQL.

After testing, stop resources without deleting retained evidence:

```powershell
docker compose -f bench/compose.yaml stop
docker compose -f bench/compose.verify.yaml stop
```
