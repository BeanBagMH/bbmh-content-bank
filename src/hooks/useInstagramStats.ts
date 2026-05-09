import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useInstagramStats() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFromCache = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('ig_stats_cache')
        .select('*')
        .eq('id', 'main')
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }
      
      if (data) {
        setStats(data);
      }
    } catch (err: any) {
      console.error('Error fetching IG stats from cache:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFromCache();
  }, []);

  // Manual refresh — calls the Edge Function to fetch fresh data from Instagram API
  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error: invokeError } = await supabase.functions.invoke('fetch-ig-stats');
      if (invokeError) throw invokeError;
      
      // Re-fetch from cache after refresh
      await fetchFromCache();
    } catch (err: any) {
      console.error('Error refreshing IG stats:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  return { stats, loading, error, refresh };
}
