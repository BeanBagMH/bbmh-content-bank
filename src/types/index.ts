export type ContentType = 
  | 'Reel' 
  | 'Carousel' 
  | 'LinkedIn Post' 
  | 'Blog' 
  | 'YouTube Short' 
  | 'Instagram Post' 
  | 'Twitter/X Post' 
  | 'Case Study' 
  | 'Email' 
  | 'Ad Creative' 
  | 'Script' 
  | 'Raw Idea'
  | 'deep_reel' 
  | 'fast_reel' 
  | 'frame' 
  | 'mirror' 
  | 'question' 
  | 'contrast' 
  | 'other';

export type Platform = 
  | 'Instagram' 
  | 'LinkedIn' 
  | 'YouTube' 
  | 'Website Blog' 
  | 'Twitter/X' 
  | 'Email' 
  | 'Multi-platform'
  | 'instagram' 
  | 'youtube_shorts' 
  | 'linkedin' 
  | 'other';

export interface ContentSource {
  id: string;
  title: string;
  source_type: 'pdf' | 'markdown' | 'pasted_text' | 'flow_doc';
  source_label: string | null;
  raw_text: string | null;
  parsed_status: string;
  created_at: string;
  updated_at: string;
}

export interface ContentScript {
  id: string;
  source_id: string | null;
  script_code: string | null;
  title: string;
  hook: string | null;
  script_body: string | null;
  content_type: ContentType;
  pillar: string | null;
  theme: string | null;
  category: string | null;
  visual_direction: string | null;
  caption_notes: string | null;
  thumbnail_headline: string | null;
  cta: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ContentCalendarPost {
  id: string;
  script_id: string | null;
  month: string | null;
  date: string | null;
  day: string | null;
  post_number: number | null;
  content_type: ContentType;
  title_or_hook: string | null;
  theme: string | null;
  cascade_parent_script_id: string | null;
  cascade_child_script_id: string | null;
  calendar_status: string;
  production_status: string;
  publishing_status: string;
  created_at: string;
  updated_at: string;
  
  // Joined fields for UI
  script?: ContentScript;
}

export interface PublishingFlowStage {
  id: string;
  stage_name: string;
  stage_order: number;
  description: string | null;
  owner: string | null;
  required_inputs: string | null;
  output: string | null;
  platform: Platform | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ContentAsset {
  id: string;
  calendar_post_id: string;
  asset_type: 'thumbnail' | 'reel_video' | 'carousel_slide' | 'caption' | 'reference' | 'raw_footage' | 'final_export';
  asset_status: string;
  notes: string | null;
  reference_url: string | null;
  file_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContentPlatformPush {
  id: string;
  calendar_post_id: string;
  platform: Platform;
  scheduled_date: string | null;
  scheduled_time: string | null;
  platform_caption: string | null;
  platform_status: 'not_started' | 'drafted' | 'scheduled' | 'published' | 'repurposed';
  published_url: string | null;
  performance_tracking_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface Campaign {
  id: string;
  name: string;
  objective: string | null;
  status: string;
  start_date: string | null;
  end_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  email: string | null;
  role: string | null;
  
  // Social IDs (Elevation 5.0)
  instagram_handle: string | null;
  youtube_channel_id: string | null;
  youtube_handle: string | null;
  linkedin_url: string | null;
  twitter_handle: string | null;
  
  // Workspace Settings
  niche: string | null;
  primary_platform: string | null;
  posting_frequency: string | null;
  timezone: string | null;
  
  updated_at: string;
}

export interface ContentItem {
  id: string;
  title: string;
  content_type: ContentType;
  platform: Platform;
  status: string;
  cluster: string;
  priority: string;
  owner: string | null;
  publish_date: string | null;
  hook: string | null;
  script: string | null;
  caption: string | null;
  cta: string | null;
  notes: string | null;
  thumbnail_idea: string | null;
  visual_direction: string | null;
  reference_url: string | null;
  asset_link: string | null;
  published_url: string | null;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  leads: number;
  campaign_id: string | null;
  ig_id: string | null;
  yt_id: string | null;
  archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface Idea {
  id: string;
  title: string;
  note: string | null;
  platform: Platform;
  cluster: string;
  status: string;
  converted_to_content_id: string | null;
  archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface ThumbnailAsset {
  id: string;
  title: string;
  related_content_id: string | null;
  thumbnail_headline: string | null;
  visual_description: string | null;
  image_url: string | null;
  reference_url: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}
