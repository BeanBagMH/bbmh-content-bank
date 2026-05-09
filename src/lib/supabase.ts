import { createClient } from '@supabase/supabase-js';
import type { ContentItem, Idea, Campaign, ThumbnailAsset } from '../types';

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
  // --- Content Items ---
  async getItems() {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('content_items')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching content items:', error);
      throw error;
    }
    return data as ContentItem[];
  },

  async addItem(item: Partial<ContentItem>) {
    if (!supabase) throw new Error('Database not configured');
    const { data, error } = await supabase
      .from('content_items')
      .insert([item])
      .select();
    
    if (error) {
      console.error('Error adding content item:', error);
      throw error;
    }
    return data[0] as ContentItem;
  },

  async updateItem(id: string, updates: Partial<ContentItem>) {
    if (!supabase) throw new Error('Database not configured');
    const { data, error } = await supabase
      .from('content_items')
      .update(updates)
      .eq('id', id)
      .select();
    
    if (error) {
      console.error('Error updating content item:', error);
      throw error;
    }
    return data[0] as ContentItem;
  },

  async deleteItem(id: string) {
    if (!supabase) throw new Error('Database not configured');
    const { error } = await supabase
      .from('content_items')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting content item:', error);
      throw error;
    }
  },

  // --- Ideas ---
  async getIdeas() {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('ideas')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching ideas:', error);
      throw error;
    }
    return data as Idea[];
  },

  async addIdea(idea: Partial<Idea>) {
    if (!supabase) throw new Error('Database not configured');
    const { data, error } = await supabase
      .from('ideas')
      .insert([idea])
      .select();
    if (error) {
      console.error('Error adding idea:', error);
      throw error;
    }
    return data[0] as Idea;
  },

  async updateIdea(id: string, updates: Partial<Idea>) {
    if (!supabase) throw new Error('Database not configured');
    const { data, error } = await supabase
      .from('ideas')
      .update(updates)
      .eq('id', id)
      .select();
    if (error) {
      console.error('Error updating idea:', error);
      throw error;
    }
    return data[0] as Idea;
  },

  async deleteIdea(id: string) {
    if (!supabase) throw new Error('Database not configured');
    const { error } = await supabase
      .from('ideas')
      .delete()
      .eq('id', id);
    if (error) {
      console.error('Error deleting idea:', error);
      throw error;
    }
  },

  // --- Campaigns ---
  async getCampaigns() {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching campaigns:', error);
      throw error;
    }
    return data as Campaign[];
  },

  async addCampaign(campaign: Partial<Campaign>) {
    if (!supabase) throw new Error('Database not configured');
    const { data, error } = await supabase
      .from('campaigns')
      .insert([campaign])
      .select();
    if (error) {
      console.error('Error adding campaign:', error);
      throw error;
    }
    return data[0] as Campaign;
  },

  async updateCampaign(id: string, updates: Partial<Campaign>) {
    if (!supabase) throw new Error('Database not configured');
    const { data, error } = await supabase
      .from('campaigns')
      .update(updates)
      .eq('id', id)
      .select();
    if (error) {
      console.error('Error updating campaign:', error);
      throw error;
    }
    return data[0] as Campaign;
  },

  async deleteCampaign(id: string) {
    if (!supabase) throw new Error('Database not configured');
    const { error } = await supabase
      .from('campaigns')
      .delete()
      .eq('id', id);
    if (error) {
      console.error('Error deleting campaign:', error);
      throw error;
    }
  },

  // --- Thumbnails ---
  async getThumbnailAssets() {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('thumbnail_assets')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching thumbnail assets:', error);
      throw error;
    }
    return data as ThumbnailAsset[];
  },

  async addThumbnailAsset(asset: Partial<ThumbnailAsset>) {
    if (!supabase) throw new Error('Database not configured');
    const { data, error } = await supabase
      .from('thumbnail_assets')
      .insert([asset])
      .select();
    if (error) {
      console.error('Error adding thumbnail asset:', error);
      throw error;
    }
    return data[0] as ThumbnailAsset;
  },

  async updateThumbnailAsset(id: string, updates: Partial<ThumbnailAsset>) {
    if (!supabase) throw new Error('Database not configured');
    const { data, error } = await supabase
      .from('thumbnail_assets')
      .update(updates)
      .eq('id', id)
      .select();
    if (error) {
      console.error('Error updating thumbnail asset:', error);
      throw error;
    }
    return data[0] as ThumbnailAsset;
  },

  async deleteThumbnailAsset(id: string) {
    if (!supabase) throw new Error('Database not configured');
    const { error } = await supabase
      .from('thumbnail_assets')
      .delete()
      .eq('id', id);
    if (error) {
      console.error('Error deleting thumbnail asset:', error);
      throw error;
    }
  },

  // --- Conversion ---
  async convertIdeaToContent(idea: Idea) {
    if (!supabase) throw new Error('Database not configured');
    
    // 1. Create content item
    const { data: contentData, error: contentError } = await supabase
      .from('content_items')
      .insert([{
        title: idea.title,
        notes: idea.note,
        platform: idea.platform,
        cluster: idea.cluster,
        status: 'Raw Idea'
      }])
      .select();
      
    if (contentError) {
      console.error('Error creating content from idea:', contentError);
      throw contentError;
    }
    const newItem = contentData[0] as ContentItem;
    
    // 2. Link idea to content
    const { error: ideaError } = await supabase
      .from('ideas')
      .update({ converted_to_content_id: newItem.id, status: 'Converted' })
      .eq('id', idea.id);
      
    if (ideaError) {
      console.error('Error linking idea to content:', ideaError);
      throw ideaError;
    }
    
    return newItem;
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
    if (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
    return data[0];
  },

  // --- Profiles (using team_members or workspace_settings) ---
  async getProfile(email: string) {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .eq('email', email)
      .maybeSingle();
    if (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
    return data;
  },

  async updateProfile(id: string, updates: any) {
    if (!supabase) throw new Error('Database not configured');
    const { data, error } = await supabase
      .from('team_members')
      .update(updates)
      .eq('id', id)
      .select();
      
    if (error) throw error;
    return data[0];
  },

  // --- Social Profiles (V4 Definitive) ---
  async getSocialProfile(userId: string) {
    if (!supabase) throw new Error('Database not configured');
    const { data, error } = await supabase
      .from('social_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async upsertSocialProfile(profile: any) {
    if (!supabase) throw new Error('Database not configured');
    const { data, error } = await supabase
      .from('social_profiles')
      .upsert(profile, { onConflict: 'user_id' })
      .select();
    
    if (error) throw error;
    return data[0];
  },

  // --- Storage ---
  async uploadFile(bucket: string, path: string, file: File) {
    if (!supabase) throw new Error('Database not configured');
    
    // 1. Upload the file
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, { upsert: true });
      
    if (error) {
      console.error('Storage upload error:', error);
      throw error;
    }
    
    // 2. Get the public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);
      
    return urlData.publicUrl;
  },

  async deleteFile(bucket: string, path: string) {
    if (!supabase) throw new Error('Database not configured');
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);
      
    if (error) {
      console.error('Storage delete error:', error);
      throw error;
    }
  }
};
