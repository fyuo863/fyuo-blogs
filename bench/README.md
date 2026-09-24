# Local blog benchmark

The new Stream pipeline, migration, recovery tests and retention rules are
documented in [visitor-pipeline.md](../docs/visitor-pipeline.md). Current validation
results are in [visitor-validation.md](../docs/visitor-validation.md).
`VISITOR_STREAM=1` adds PostgreSQL ledger/count verification after draining the
queue; omit it when measuring the original backend. `resilience.mjs` separately
tests cold/hot reads, bursts, duplicate IDs, PostgreSQL interruption and Redis
interruption. It intentionally stops only services in the `fyuo-bench` project.

To compile the historical baseline without modifying your checkout:

```powershell
python bench/build-baseline.py
Copy-Item bench/backend-baseline bench/backend-linux
docker compose -f bench/compose.yaml -f bench/compose.local.yaml up -d --build --wait
```

For a controlled comparison, keep the same Redis AOF policy using the
`bench/compose.streams.yaml` override for **both** versions. The original binary
ignores the new feature flag. Stop HTTP and drain first before preparing legacy
counters with `node bench/snapshot-legacy.mjs`. Do not run the old binary alongside
new consumers. The test-only counter snapshot does not modify PostgreSQL history.

## Visitor flow

After `run.mjs` has created the isolated 1,000-article dataset, run:

```powershell
node bench/visitor.mjs
docker compose -f bench/compose.yaml stop
```

This reuses synthetic data and snapshots starting counts, so previous counts are
not mistaken for new visits. Each client requests the first-page list, one article
detail, and a view increment sequentially, rotating over the 10 first-page articles.
There is no reading delay: this is an API stress workload, not human traffic or UV.
Each stage runs for 10 seconds at 10/50/100/200 concurrent clients, for three rounds.
More than 5% failed flows stops escalation. Reports checkpoint after each stage,
record stage latency including failures, successful complete-flow throughput,
per-article count deltas and ambiguous counter outcomes when writes fail.
Report directories start with `visitor-`. No production data or browser is used.

Requires Docker Desktop (Linux containers) and Node.js 20+.
If registry access is unavailable but `blog-backend:local` is cached, compile current
source using the locally installed Go version and use the local build override:

```powershell
Push-Location backend
$env:GOOS='linux'; $env:GOARCH='amd64'; $env:CGO_ENABLED='0'
go build -o ../bench/backend-linux ./main.go
Remove-Item Env:GOOS,Env:GOARCH,Env:CGO_ENABLED
Pop-Location
docker compose -f bench/compose.yaml -f bench/compose.local.yaml up -d --build --wait
```

The cached image supplies the runtime only; `/app/main` and configs are replaced
with the current source build. Reports record the resulting backend image ID and
Docker CPU/memory allocation.

Run from the repository root:

```powershell
docker compose -f bench/compose.yaml up -d --build --wait
node --test bench/run.test.mjs
node bench/run.mjs
docker compose -f bench/compose.yaml down -v
```

This independent Compose project never reads production .env or production volumes.
Only backend port 18090 is bound to loopback. Credentials are disposable local test credentials.
Recreate the stack with `down -v` before another run; the runner refuses a nonempty database.

Seeds 1,000 articles of 2,048 ASCII bytes via the real API. After a 3-second warmup,
tests 10/50/100/200 concurrent closed-loop clients, 10 seconds per stage, 3 repetitions
with alternating order. Override BENCH_SECONDS (1-120) and BENCH_REPEATS (1-10).
Reports successful RPS, total RPS, error breakdown and all-request P50/P95/P99/max.
Latency includes reading and parsing the response. Requests have a 10-second deadline.
Stage elapsed time includes draining in-flight requests. No automatic retries.

Then sends 10,000 view increments with concurrency 100 and compares API counter delta
against acknowledged requests. Any failed request makes correctness inconclusive,
since a timed-out request may have committed. This endpoint also records visits in
PostgreSQL: it is not a Redis-only microbenchmark. Likes toggle state and must not be
treated as monotonically increasing counts.

Results and failures are saved in timestamped results/*/report.json. Do not claim
cache speedup, SQL reduction, persistence correctness, production maximum capacity,
or zero data loss from this suite. It measures a warm-cache baseline and one counter
scenario on a shared client/server host, without Nginx/TLS. Record Docker CPU/memory
limits as well as host specs when citing results. For capacity qualification, run
longer tests from a separate load host with server resource monitoring.
