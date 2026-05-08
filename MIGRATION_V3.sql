-- BBMh Content OS V3 Migration
-- Run this in your Supabase SQL Editor

-- 1. Expand content_items table
ALTER TABLE content_items 
ADD COLUMN IF NOT EXISTS platform TEXT,
ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'Medium',
ADD COLUMN IF NOT EXISTS owner TEXT,
ADD COLUMN IF NOT EXISTS content_cluster TEXT,
ADD COLUMN IF NOT EXISTS caption TEXT,
ADD COLUMN IF NOT EXISTS cta TEXT,
ADD COLUMN IF NOT EXISTS notes TEXT,
ADD COLUMN IF NOT EXISTS thumbnail_idea TEXT,
ADD COLUMN IF NOT EXISTS visual_direction TEXT,
ADD COLUMN IF NOT EXISTS asset_links TEXT[],
ADD COLUMN IF NOT EXISTS reference_links TEXT[],
ADD COLUMN IF NOT EXISTS published_url TEXT,
ADD COLUMN IF NOT EXISTS performance_stats JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS campaign_id UUID,
ADD COLUMN IF NOT EXISTS last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 2. Create Ideas table (for raw brain dumps)
CREATE TABLE IF NOT EXISTS ideas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  note TEXT,
  platform TEXT,
  content_cluster TEXT,
  status TEXT DEFAULT 'Raw Idea',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id)
);

-- 3. Create Campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  objective TEXT,
  status TEXT DEFAULT 'Planning',
  start_date DATE,
  end_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create Thumbnails table
CREATE TABLE IF NOT EXISTS thumbnails (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content_item_id UUID REFERENCES content_items(id),
  headline TEXT,
  visual_description TEXT,
  reference_links TEXT[],
  status TEXT DEFAULT 'Idea',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create Team Members table (optional, but good for owner field)
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT,
  email TEXT,
  role TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for all tables
ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE thumbnails ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Add basic policies (example: all authenticated users can read/write)
-- You may want to refine these based on your team structure
CREATE POLICY "Enable all for authenticated users" ON content_items FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all for authenticated users" ON ideas FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all for authenticated users" ON campaigns FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all for authenticated users" ON thumbnails FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all for authenticated users" ON team_members FOR ALL USING (auth.role() = 'authenticated');

-- Function to update last_updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_content_items_updated_at
BEFORE UPDATE ON content_items
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();
