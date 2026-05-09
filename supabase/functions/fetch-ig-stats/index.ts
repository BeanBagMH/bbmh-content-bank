import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const token   = Deno.env.get('IG_ACCESS_TOKEN')!;
  const userId  = Deno.env.get('IG_USER_ID')!;
  const supaUrl = Deno.env.get('SUPABASE_URL')!;
  const supaKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supaUrl, supaKey);

  try {
    // 1. Account overview
    const accRes = await fetch(
      `https://graph.facebook.com/v21.0/${userId}?fields=followers_count,media_count&access_token=${token}`
    );
    const accData = await accRes.json();

    if (accData.error) {
      throw new Error(`IG Account API Error: ${accData.error.message}`);
    }

    // 2. Recent media with stats
    const mediaRes = await fetch(
      `https://graph.facebook.com/v21.0/${userId}/media?fields=id,caption,media_type,timestamp,like_count,comments_count,permalink,thumbnail_url,media_url&access_token=${token}`
    );
    const mediaData = await mediaRes.json();

    if (mediaData.error) {
      throw new Error(`IG Media API Error: ${mediaData.error.message}`);
    }

    // 3. Store in Supabase
    const { error: upsertError } = await supabase.from('ig_stats_cache').upsert({
      id: 'main',
      followers: accData.followers_count || 0,
      media_count: accData.media_count || 0,
      posts: mediaData.data || [],
      fetched_at: new Date().toISOString()
    });

    if (upsertError) {
      throw new Error(`Supabase Upsert Error: ${upsertError.message}`);
    }

    return new Response(JSON.stringify({ success: true, followers: accData.followers_count }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});
