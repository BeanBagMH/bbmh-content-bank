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
  content_cluster: ContentCluster;
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
  reference_links: string[];
  asset_links: string[];
  reference_url: string | null;
  asset_link: string | null;
  
  // Publishing & Performance
  published_url: string | null;
  performance_stats: {
    views?: number;
    likes?: number;
    comments?: number;
    shares?: number;
    saves?: number;
    ctr?: number;
    leads?: number;
  };
  
  campaign_id: string | null;
  created_at: string;
  updated_at: string;
  last_updated_at: string;
}

export interface Idea {
  id: string;
  title: string;
  note: string | null;
  platform: Platform | null;
  content_cluster: ContentCluster | null;
  status: string;
  created_at: string;
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
}

export interface Thumbnail {
  id: string;
  title: string;
  content_item_id: string | null;
  headline: string | null;
  visual_description: string | null;
  image_url: string | null;
  reference_links: string[];
  status: string;
  created_at: string;
}
