ALTER TABLE plugins ADD COLUMN IF NOT EXISTS sort_order integer NOT NULL DEFAULT 1000;
CREATE INDEX IF NOT EXISTS idx_plugins_sort_order ON plugins (sort_order);
