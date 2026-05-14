// @ts-nocheck
import { createClient } from '@supabase/supabase-js';
import type { 
  ContentSource, 
  ContentScript, 
  ContentCalendarPost, 
  PublishingFlowStage, 
  ContentAsset, 
  ContentPlatformPush,
  Campaign 
} from '../types';

const getEnv = (key: string) => import.meta.env[key] || '';

const supabaseUrl = getEnv('VITE_SUPABASE_URL').trim();
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY').trim();

export const isConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('http')
);

let supabaseClient: any = null;

if (isConfigured) {
  try {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  } catch (e) {
    console.error('Supabase init failed:', e);
  }
}

export const supabase = supabaseClient;

export const db = {
  // --- Content Sources ---
  async getSources() {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('content_sources')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    return data as ContentSource[];
  },

  // --- Content Scripts ---
  async getScripts() {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('content_scripts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as ContentScript[];
  },
  
  async updateScript(id: string, updates: Partial<ContentScript>) {
    if (!supabase) throw new Error('Database not configured');
    const { data, error } = await supabase
      .from('content_scripts')
      .update(updates)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0] as ContentScript;
  },

  // --- Content Calendar Posts ---
  async getCalendarPosts() {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('content_calendar_posts')
      .select(`
        *,
        script:content_scripts(*)
      `)
      .order('post_number', { ascending: true });
    
    if (error) throw error;
    return data as ContentCalendarPost[];
  },

  async updateCalendarPost(id: string, updates: Partial<ContentCalendarPost>) {
    if (!supabase) throw new Error('Database not configured');
    const { data, error } = await supabase
      .from('content_calendar_posts')
      .update(updates)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0] as ContentCalendarPost;
  },

  // --- Publishing Flow ---
  async getPublishingFlow() {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('content_publishing_flow')
      .select('*')
      .order('stage_order', { ascending: true });
    
    if (error) throw error;
    return data as PublishingFlowStage[];
  },

  // --- Content Assets ---
  async getAssetsByPost(postId: string) {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('content_assets')
      .select('*')
      .eq('calendar_post_id', postId);
      
    if (error) throw error;
    return data as ContentAsset[];
  },

  // --- Platform Push ---
  async getPlatformPushByPost(postId: string) {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('content_platform_push')
      .select('*')
      .eq('calendar_post_id', postId);
      
    if (error) throw error;
    return data as ContentPlatformPush[];
  },

  // --- Workspace Settings ---
  async getSettings(key: string) {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('workspace_settings')
      .select('value')
      .eq('key', key)
      .single();
    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching settings:', error);
      throw error;
    }
    return data?.value;
  },

  async updateSettings(key: string, value: any) {
    if (!supabase) throw new Error('Database not configured');
    const { data, error } = await supabase
      .from('workspace_settings')
      .upsert({ key, value, updated_at: new Date().toISOString() })
      .select();
    if (error) throw error;
    return data[0];
  },

  // --- Storage ---
  async uploadFile(bucket: string, path: string, file: File) {
    if (!supabase) throw new Error('Database not configured');
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, { upsert: true });
      
    if (error) throw error;
    
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);
      
    return urlData.publicUrl;
  }
};
