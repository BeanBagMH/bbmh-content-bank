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
  | 'Raw Idea';

export type Platform = 
  | 'Instagram' 
  | 'LinkedIn' 
  | 'YouTube' 
  | 'Website Blog' 
  | 'Twitter/X' 
  | 'Email' 
  | 'Multi-platform';

export type ContentStatus = 
  | 'Raw Idea' 
  | 'Selected' 
  | 'Research' 
  | 'Scripting' 
  | 'Design' 
  | 'Editing' 
  | 'Review' 
  | 'Scheduled' 
  | 'Published' 
  | 'Archived';

export type ContentCluster = 
  | 'Brand Invisibility' 
  | 'Trust Building' 
  | 'Price War' 
  | 'Website Strategy' 
  | 'Branding' 
  | 'Design Education' 
  | 'AI Workflow' 
  | 'Client Case Study' 
  | 'Behind The Scenes' 
  | 'Founder Story' 
  | 'Sales / Outreach' 
  | 'General';

export type Priority = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface ContentItem {
  id: string;
  title: string;
  content_type: ContentType;
  platform: Platform;
  status: ContentStatus;
  cluster: ContentCluster;
  priority: Priority;
  owner: string | null;
  publish_date: string | null; // ISO Date
  
  // Content Writing
  hook: string | null;
  script: string | null;
  caption: string | null;
  cta: string | null;
  notes: string | null;
  
  // Creative Direction
  thumbnail_idea: string | null;
  visual_direction: string | null;
  reference_url: string | null;
  asset_link: string | null;
  
  // Publishing & Performance
  published_url: string | null;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  leads: number;
  
  campaign_id: string | null;
  ig_id: string | null; // For Meta Graph API linking
  yt_id: string | null; // For YouTube Analytics API linking
  archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface Idea {
  id: string;
  title: string;
  note: string | null;
  platform: Platform;
  cluster: ContentCluster;
  status: string;
  converted_to_content_id: string | null;
  archived: boolean;
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
