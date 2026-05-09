import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // Get secrets
  const IG_TOKEN   = Deno.env.get("IG_ACCESS_TOKEN");
  const IG_USER_ID = Deno.env.get("IG_USER_ID");
  const SUPA_URL   = Deno.env.get("SUPABASE_URL");
  const SUPA_KEY   = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  // Log what we have
  console.log("Token present:", !!IG_TOKEN);
  console.log("User ID present:", !!IG_USER_ID);

  // Check secrets exist
  if (!IG_TOKEN || !IG_USER_ID) {
    const msg = `Missing secrets: TOKEN=${!!IG_TOKEN} USER_ID=${!!IG_USER_ID}`;
    console.error(msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    // 1. Fetch account stats
    const accountUrl = `https://graph.facebook.com/v21.0/${IG_USER_ID}?fields=followers_count,media_count,name&access_token=${IG_TOKEN}`;
    const accountRes  = await fetch(accountUrl);
    const accountData = await accountRes.json();

    if (accountData.error) {
      throw new Error(`Instagram API Error: ${accountData.error.message} (code: ${accountData.error.code})`);
    }

    // 2. Fetch recent media
    const mediaUrl = `https://graph.facebook.com/v21.0/${IG_USER_ID}/media?fields=id,caption,media_type,timestamp,like_count,comments_count,permalink,media_url,thumbnail_url&limit=20&access_token=${IG_TOKEN}`;
    const mediaRes  = await fetch(mediaUrl);
    const mediaData = await mediaRes.json();

    if (mediaData.error) {
      throw new Error(`Media API Error: ${mediaData.error.message}`);
    }

    // 3. Save to Supabase
    const supabase = createClient(SUPA_URL!, SUPA_KEY!);

    const { error: upsertError } = await supabase
      .from("ig_stats_cache")
      .upsert({
        id:          "bbmh_main",
        followers:   accountData.followers_count || 0,
        media_count: accountData.media_count     || 0,
        posts:       mediaData.data              || [],
        raw_response: accountData,
        error_log:   null,
        fetched_at:  new Date().toISOString(),
      }, { onConflict: "id" });

    if (upsertError) {
      throw new Error(`Supabase upsert error: ${upsertError.message}`);
    }

    return new Response(
      JSON.stringify({
        success:   true,
        followers: accountData.followers_count,
        posts:     mediaData.data?.length || 0,
        message:   "Instagram stats fetched and cached successfully",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (err: any) {
    // Save error to database so we can see it from the app
    try {
      const supabase = createClient(SUPA_URL!, SUPA_KEY!);
      await supabase.from("ig_stats_cache").upsert({
        id:        "bbmh_main",
        error_log: err.message,
        fetched_at: new Date().toISOString(),
      }, { onConflict: "id" });
    } catch (_) {}

    console.error("FUNCTION ERROR:", err.message);
    return new Response(
      JSON.stringify({ error: err.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
