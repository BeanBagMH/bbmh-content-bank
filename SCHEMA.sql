-- RUN THIS IN YOUR SUPABASE SQL EDITOR
-- This adds the necessary columns for the Script Bank content

ALTER TABLE content_items 
ADD COLUMN IF NOT EXISTS hook TEXT,
ADD COLUMN IF NOT EXISTS script_content TEXT,
ADD COLUMN IF NOT EXISTS director_notes TEXT,
ADD COLUMN IF NOT EXISTS cluster_name TEXT;

-- Update the content types if necessary
-- ALTER TYPE content_type ADD VALUE IF NOT EXISTS 'video';
-- ALTER TYPE content_type ADD VALUE IF NOT EXISTS 'social';
-- ALTER TYPE content_type ADD VALUE IF NOT EXISTS 'blog';
