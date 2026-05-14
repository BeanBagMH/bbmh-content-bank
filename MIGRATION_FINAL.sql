-- BBMh Content OS V3.2.0 - MASTER MIGRATION
-- This script prepares the database for full functionality.

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Content Items Table
CREATE TABLE IF NOT EXISTS public.content_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    content_type TEXT,
    platform TEXT,
    status TEXT DEFAULT 'Raw Idea',
    content_cluster TEXT,
    campaign_id UUID,
    priority TEXT DEFAULT 'Medium',
    owner TEXT,
    publish_date DATE,
    
    -- Content Writing
    hook TEXT,
    script TEXT,
    caption TEXT,
    cta TEXT,
    notes TEXT,
    
    -- Creative Direction
    thumbnail_idea TEXT,
    visual_direction TEXT,
    reference_links TEXT[] DEFAULT '{}',
    asset_links TEXT[] DEFAULT '{}',
    reference_url TEXT,
    asset_link TEXT,
    
    -- Publishing & Performance
    published_url TEXT,
    performance_stats JSONB DEFAULT '{
        "views": 0,
        "likes": 0,
        "comments": 0,
        "shares": 0,
        "saves": 0,
        "ctr": 0,
        "leads": 0
    }',
    
    archived BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Ideas Vault Table
CREATE TABLE IF NOT EXISTS public.ideas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    note TEXT,
    platform TEXT,
    content_cluster TEXT,
    status TEXT DEFAULT 'New',
    converted_to_content_id UUID,
    archived BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Campaigns Table
CREATE TABLE IF NOT EXISTS public.campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    objective TEXT,
    status TEXT DEFAULT 'Planning',
    start_date DATE,
    end_date DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Thumbnail Assets Table
CREATE TABLE IF NOT EXISTS public.thumbnail_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    content_item_id UUID,
    thumbnail_headline TEXT,
    visual_description TEXT,
    image_url TEXT,
    reference_url TEXT,
    status TEXT DEFAULT 'Draft',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Workspace Settings Table
CREATE TABLE IF NOT EXISTS public.workspace_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Realtime Setup
ALTER PUBLICATION supabase_realtime ADD TABLE content_items;
ALTER PUBLICATION supabase_realtime ADD TABLE ideas;
ALTER PUBLICATION supabase_realtime ADD TABLE campaigns;
ALTER PUBLICATION supabase_realtime ADD TABLE thumbnail_assets;

-- 8. Helper: Update Updated_At Trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_content_items_updated_at BEFORE UPDATE ON content_items FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_ideas_updated_at BEFORE UPDATE ON ideas FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON campaigns FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_thumbnail_assets_updated_at BEFORE UPDATE ON thumbnail_assets FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- 9. Explicit Data API Access Grants (Required for Supabase post May 30, 2026)
GRANT SELECT ON public.content_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.content_items TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.content_items TO service_role;

GRANT SELECT ON public.ideas TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ideas TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ideas TO service_role;

GRANT SELECT ON public.campaigns TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.campaigns TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.campaigns TO service_role;

GRANT SELECT ON public.thumbnail_assets TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.thumbnail_assets TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.thumbnail_assets TO service_role;

GRANT SELECT ON public.workspace_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.workspace_settings TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.workspace_settings TO service_role;
