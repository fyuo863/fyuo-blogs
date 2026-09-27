ALTER TABLE plugins ADD COLUMN IF NOT EXISTS managed_by_admin BOOLEAN NOT NULL DEFAULT FALSE;
-- Existing manually uploaded active versions are already administrator choices.
UPDATE plugins SET managed_by_admin = TRUE
WHERE created_by <> 0 OR status = 'disabled' OR EXISTS (
  SELECT 1 FROM plugin_versions v
  WHERE v.plugin_id = plugins.id AND v.version = plugins.active_version AND v.created_by <> 0
);
