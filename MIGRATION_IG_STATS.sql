-- Create Instagram Stats Cache Table
CREATE TABLE IF NOT EXISTS ig_stats_cache (
  id          TEXT PRIMARY KEY DEFAULT 'main',
  followers   INTEGER DEFAULT 0,
  media_count INTEGER DEFAULT 0,
  posts       JSONB DEFAULT '[]',
  fetched_at  TIMESTAMPTZ DEFAULT now()
);

-- Disable RLS for internal cache table (or set up specific policies)
ALTER TABLE ig_stats_cache DISABLE ROW LEVEL SECURITY;
