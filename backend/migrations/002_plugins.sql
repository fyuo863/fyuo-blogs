CREATE TABLE IF NOT EXISTS plugins (
  id BIGSERIAL PRIMARY KEY,
  slug VARCHAR(80) NOT NULL UNIQUE,
  name VARCHAR(160) NOT NULL,
  type VARCHAR(20) NOT NULL,
  status VARCHAR(20) NOT NULL,
  active_version VARCHAR(80),
  created_by BIGINT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS plugin_versions (
  id BIGSERIAL PRIMARY KEY,
  plugin_id BIGINT NOT NULL REFERENCES plugins(id) ON DELETE CASCADE,
  version VARCHAR(80) NOT NULL,
  manifest_json JSONB NOT NULL,
  storage_path TEXT NOT NULL,
  content_hash CHAR(64) NOT NULL,
  status VARCHAR(20) NOT NULL,
  created_by BIGINT NOT NULL,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(plugin_id, version)
);
CREATE INDEX IF NOT EXISTS idx_plugins_status ON plugins(status);
CREATE INDEX IF NOT EXISTS idx_plugin_versions_status ON plugin_versions(status);
