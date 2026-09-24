-- Additive, idempotent schema only. No history/baseline modification.
BEGIN;
CREATE TABLE IF NOT EXISTS visit_migrations (
 name text PRIMARY KEY,
 applied_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS visit_events (
 event_id varchar(46) PRIMARY KEY,
 article_id bigint NOT NULL,
 occurred_at timestamptz NOT NULL,
 received_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS visit_events_received_at ON visit_events(received_at);
CREATE TABLE IF NOT EXISTS visit_failures (
 stream_id text PRIMARY KEY,
 payload jsonb NOT NULL,
 reason text NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now()
);
COMMIT;
