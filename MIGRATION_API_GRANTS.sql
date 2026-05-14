-- Supabase Data API Security Update (May 30, 2026 Policy Change)
-- Run this in your Supabase SQL Editor to explicitly grant access to the Data API.
-- Without this, your app will lose access to these tables.

-- Grant access per role for content_items
GRANT SELECT ON public.content_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.content_items TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.content_items TO service_role;

-- Grant access per role for ideas
GRANT SELECT ON public.ideas TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ideas TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ideas TO service_role;

-- Grant access per role for campaigns
GRANT SELECT ON public.campaigns TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.campaigns TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.campaigns TO service_role;

-- Grant access per role for thumbnail_assets
GRANT SELECT ON public.thumbnail_assets TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.thumbnail_assets TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.thumbnail_assets TO service_role;

-- Grant access per role for workspace_settings
GRANT SELECT ON public.workspace_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.workspace_settings TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.workspace_settings TO service_role;

-- Grant access per role for thumbnails
GRANT SELECT ON public.thumbnails TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.thumbnails TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.thumbnails TO service_role;

-- Grant access per role for team_members
GRANT SELECT ON public.team_members TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.team_members TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.team_members TO service_role;

-- Grant access per role for ig_stats_cache
GRANT SELECT ON public.ig_stats_cache TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ig_stats_cache TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ig_stats_cache TO service_role;
