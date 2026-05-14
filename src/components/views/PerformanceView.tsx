// @ts-nocheck
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Target, 
  ArrowUp, 
  ArrowDown,
  Camera,
  Video,
  PieChart,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import type { ContentItem } from '../../types';
import { cn } from '../common/Badge';
import { useYouTubeStats } from '../../hooks/useYouTubeStats';
import { useInstagramStats } from '../../hooks/useInstagramStats';
import { supabase } from '../../lib/supabase';

interface PerformanceViewProps {
  items: ContentItem[];
}

export const PerformanceView: React.FC<PerformanceViewProps> = ({ items }) => {
  const [platformFilter, setPlatformFilter] = useState<'All' | 'Instagram' | 'YouTube'>('All');
  const [igRefreshing, setIgRefreshing] = useState(false);
  const [igRefreshError, setIgRefreshError] = useState<string | null>(null);

  const { channel, videos, loading: ytLoading, error: ytError } = useYouTubeStats();
  const { stats: igStats, loading: igLoading, error: igError, refresh: reloadIG, setStats: setIgStats } = useInstagramStats();
  
  const handleRefreshInstagram = async () => {
    setIgRefreshing(true);
    setIgRefreshError(null);

    try {
      // Call the Edge Function
      const { data, error } = await supabase.functions.invoke('fetch-ig-stats');

      if (error) {
        setIgRefreshError(`Function connection error: ${error.message}`);
        setIgRefreshing(false);
        return;
      }

      if (data?.error) {
        setIgRefreshError(`Instagram API error: ${data.error}`);
        setIgRefreshing(false);
        return;
      }

      // Success — reload the cached data from Supabase
      const { data: cached, error: fetchError } = await supabase
        .from('ig_stats_cache')
        .select('*')
        .eq('id', 'bbmh_main')
        .single();

      if (fetchError) {
        setIgRefreshError(`Sync succeeded but failed to read cache: ${fetchError.message}`);
      } else if (cached) {
        setIgStats(cached);
      }
    } catch (err: any) {
      setIgRefreshError(err.message);
    } finally {
      setIgRefreshing(false);
    }
  };

  const publishedItems = items.filter(i => {
    const isPublished = i.status === 'Published' || i.status === 'published';
    if (platformFilter === 'All') return isPublished;
    const isMulti = i.platform === 'MULTI' || i.platform === 'Multi-platform' || i.platform === 'Multi';
    return isPublished && (i.platform === platformFilter || isMulti);
  });
  
  const totalStats = publishedItems.reduce((acc, item) => {
    return {
      views: acc.views + (item.views || 0),
      likes: acc.likes + (item.likes || 0),
      leads: acc.leads + (item.leads || 0),
      shares: acc.shares + (item.shares || 0)
    };
  }, { views: 0, likes: 0, leads: 0, shares: 0 });

  const ytReach = channel?.totalViews || 0;
  const ytEngagement = videos.reduce((a, v) => a + v.likes + v.comments, 0);
  
  const displayStats = {
    reach: platformFilter === 'YouTube' ? ytReach : (platformFilter === 'All' ? totalStats.views + ytReach : totalStats.views),
    engagement: platformFilter === 'YouTube' ? ytEngagement : (platformFilter === 'All' ? totalStats.likes + ytEngagement : totalStats.likes),
    conversions: totalStats.leads,
    virality: totalStats.shares,
    subscribers: channel?.subscribers || 0,
    videoCount: channel?.videoCount || 0
  };

  return (
    <div className="space-y-12 pb-24">
      {/* YouTube Diagnostic */}
      {platformFilter === 'YouTube' && !import.meta.env.VITE_YOUTUBE_API_KEY && (
        <div className="bg-yt/5 border border-yt/20 rounded-3xl p-6 flex items-center gap-4 text-yt animate-pulse">
          <AlertCircle size={24} />
          <div className="flex-1">
            <div className="text-sm font-black uppercase tracking-widest">YouTube API Key Missing</div>
            <div className="text-[11px] font-bold opacity-60">Add VITE_YOUTUBE_API_KEY to Vercel and redeploy to see live channel stats.</div>
          </div>
        </div>
      )}

      {/* Instagram Diagnostic */}
      {platformFilter === 'Instagram' && igRefreshError && (
        <div className="bg-red-500/5 border border-red-500/20 rounded-3xl p-6 flex items-center gap-4 text-red-500">
          <AlertCircle size={24} />
          <div className="flex-1">
            <div className="text-sm font-black uppercase tracking-widest">Instagram Sync Failed</div>
            <div className="text-[11px] font-bold opacity-60">{igRefreshError}</div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <h2 className="text-5xl lg:text-7xl font-display font-bold text-dark tracking-tighter mb-4 italic-serif">Strategic Intelligence</h2>
           <p className="text-ash/60 text-[11px] font-bold uppercase tracking-[0.4em]">Aggregated Performance & Conversion Metrics</p>
        </div>

        <div className="flex bg-light-grey p-1 rounded-xl self-start md:self-end shadow-inner border border-mist">
           <button 
             onClick={() => setPlatformFilter('All')}
             className={cn("px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all", platformFilter === 'All' ? "bg-white text-dark shadow-md" : "text-ash/40 hover:text-dark")}
           >
             Global
           </button>
           <button 
             onClick={() => setPlatformFilter('Instagram')}
             className={cn("px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2", platformFilter === 'Instagram' ? "bg-ig text-white shadow-md shadow-ig/20" : "text-ash/40 hover:text-ig")}
           >
             <Camera size={14} />
             IG
           </button>
           <button 
             onClick={() => setPlatformFilter('YouTube')}
             className={cn("px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2", platformFilter === 'YouTube' ? "bg-yt text-white shadow-md shadow-yt/20" : "text-ash/40 hover:text-yt")}
           >
             <Video size={14} />
             YT
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        <StatCard 
          label={platformFilter === 'YouTube' ? "Channel Views" : platformFilter === 'Instagram' ? "IG Followers" : "Total Reach"} 
          value={platformFilter === 'Instagram' ? (igStats?.followers || 0) : displayStats.reach} 
          icon={TrendingUp} trend="+12.5%" isPositive={true} 
          color={platformFilter === 'Instagram' ? 'ig' : platformFilter === 'YouTube' ? 'yt' : 'cyan'} 
        />
        <StatCard 
          label="Engagement" 
          value={platformFilter === 'Instagram' ? (igStats?.posts?.reduce((a:any,p:any)=>a+(p.like_count||0),0) || 0) : displayStats.engagement} 
          icon={Users} trend="+8.2%" isPositive={true} 
          color={platformFilter === 'Instagram' ? 'ig' : platformFilter === 'YouTube' ? 'yt' : 'cyan'} 
        />
        <StatCard 
          label={platformFilter === 'YouTube' ? "Videos Live" : platformFilter === 'Instagram' ? "Total Posts" : "Conversions"} 
          value={platformFilter === 'YouTube' ? displayStats.videoCount : platformFilter === 'Instagram' ? (igStats?.media_count || 0) : displayStats.conversions} 
          icon={platformFilter === 'YouTube' ? Video : platformFilter === 'Instagram' ? Camera : Target} trend="-2.1%" isPositive={false} 
          color={platformFilter === 'Instagram' ? 'ig' : platformFilter === 'YouTube' ? 'yt' : 'cyan'} 
        />
        <StatCard 
          label={platformFilter === 'YouTube' ? "Subscribers" : platformFilter === 'Instagram' ? "Last Synced" : "Virality"} 
          value={platformFilter === 'YouTube' ? displayStats.subscribers : platformFilter === 'Instagram' ? 0 : displayStats.virality} 
          customValue={platformFilter === 'Instagram' ? (igStats?.fetched_at ? new Date(igStats.fetched_at).toLocaleDateString('en-IN', {day:'numeric', month:'short'}) : 'N/A') : undefined}
          icon={platformFilter === 'YouTube' ? Users : BarChart3} trend="+24.0%" isPositive={true} 
          color={platformFilter === 'Instagram' ? 'ig' : platformFilter === 'YouTube' ? 'yt' : 'cyan'} 
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 bg-white border border-mist rounded-[40px] overflow-hidden shadow-sm flex flex-col">
          <div className="p-8 lg:p-10 border-b border-mist flex justify-between items-center bg-light-grey/10">
             <h3 className="text-xl font-display font-bold text-dark tracking-tight">
               {platformFilter === 'YouTube' ? 'YouTube Video Performance' : platformFilter === 'Instagram' ? 'Instagram Media Performance' : 'Content Leaderboard'}
             </h3>
             <div className="flex items-center gap-6">
                {platformFilter === 'Instagram' && (
                  <button 
                    onClick={handleRefreshInstagram}
                    disabled={igRefreshing}
                    className="flex items-center gap-2 px-4 py-2 bg-ig/10 text-ig rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-ig hover:text-white transition-all disabled:opacity-50"
                  >
                    <RefreshCw size={12} className={cn(igRefreshing && "animate-spin")} />
                    {igRefreshing ? 'Syncing...' : 'Refresh'}
                  </button>
                )}
                <div className="flex items-center gap-2 text-[10px] font-bold text-ash/40 uppercase tracking-widest">
                    <PieChart size={14} />
                    {platformFilter === 'YouTube' ? 'Live Channel Stats' : platformFilter === 'Instagram' ? 'Live Media Stats' : 'High Impact Content'}
                </div>
             </div>
          </div>
          
          <div className="overflow-x-auto flex-1 custom-scrollbar">
            {platformFilter === 'YouTube' ? (
              <div className="p-8">
                {ytLoading && <div className="py-12 text-center text-ash/40 animate-pulse uppercase tracking-[0.2em] text-[10px] font-bold">Loading Live YouTube Stats...</div>}
                {ytError && <div className="py-8 text-center text-red-500 text-[10px] font-bold uppercase tracking-widest">Error: {ytError}</div>}
                
                <div className="space-y-2">
                  {videos.map(video => (
                    <div key={video.id} className="flex items-center gap-6 p-6 hover:bg-light-grey/20 rounded-2xl transition-all border border-transparent hover:border-mist/50 group">
                      <div className="relative flex-shrink-0">
                        <img src={video.thumbnail} className="w-32 aspect-video rounded-xl object-cover shadow-lg group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute bottom-2 right-2 bg-dark/80 backdrop-blur-sm text-white text-[8px] font-bold px-2 py-1 rounded">
                          {video.duration.replace('PT', '').replace('M', ':').replace('S', '')}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[14px] font-bold text-dark group-hover:text-yt transition-colors line-clamp-2 leading-tight mb-2">{video.title}</div>
                        <div className="text-[10px] font-medium text-ash/40 uppercase tracking-widest">
                          {new Date(video.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-black text-dark">{video.views.toLocaleString()} <span className="text-[9px] font-bold text-ash/40 uppercase tracking-tighter">Views</span></div>
                        <div className="flex items-center justify-end gap-3 mt-1">
                          <span className="text-[10px] font-bold text-ash/30">❤️ {video.likes.toLocaleString()}</span>
                          <span className="text-[10px] font-bold text-ash/30">💬 {video.comments.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : platformFilter === 'Instagram' ? (
              <div className="p-8">
                {igLoading && <div className="py-12 text-center text-ash/40 animate-pulse uppercase tracking-[0.2em] text-[10px] font-bold">Fetching Live Instagram Stats...</div>}
                {igError && <div className="py-8 text-center text-red-500 text-[10px] font-bold uppercase tracking-widest">Error: {igError}</div>}
                {!igStats && !igLoading && !igError && (
                  <div className="py-24 text-center">
                    <p className="text-ash/40 text-sm italic mb-6">No Instagram data cached yet.</p>
                    <button 
                      onClick={handleRefreshInstagram}
                      className="px-8 py-4 bg-ig text-white rounded-xl text-[11px] font-black uppercase tracking-[0.2em] shadow-lg shadow-ig/20 hover:scale-105 transition-all"
                    >
                      Connect & Fetch Stats
                    </button>
                  </div>
                )}
                
                {igStats && (
                  <div className="space-y-2">
                    {igStats.posts?.map((post: any) => (
                      <div key={post.id} className="flex items-center gap-6 p-6 hover:bg-light-grey/20 rounded-2xl transition-all border border-transparent hover:border-mist/50 group">
                        <div className="relative flex-shrink-0">
                          <img src={post.thumbnail_url || post.media_url} className="w-24 h-24 rounded-xl object-cover shadow-lg group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute top-2 right-2 bg-dark/60 backdrop-blur-sm text-white text-[7px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter">
                            {post.media_type}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[13px] font-medium text-dark group-hover:text-ig transition-colors line-clamp-2 leading-relaxed mb-2">
                            {post.caption || "No caption provided"}
                          </div>
                          <div className="text-[10px] font-medium text-ash/40 uppercase tracking-widest">
                            {new Date(post.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-black text-dark">❤️ {post.like_count?.toLocaleString() || 0}</div>
                          <div className="text-[10px] font-bold text-ash/40 uppercase tracking-widest mt-1">
                            💬 {post.comments_count?.toLocaleString() || 0} Comments
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b border-mist/50">
                    <th className="p-8 text-[10px] font-black text-ash/40 uppercase tracking-widest">Piece Title</th>
                    <th className="p-8 text-[10px] font-black text-ash/40 uppercase tracking-widest text-center">Views</th>
                    <th className="p-8 text-[10px] font-black text-ash/40 uppercase tracking-widest text-center">Engagement</th>
                    <th className="p-8 text-[10px] font-black text-ash/40 uppercase tracking-widest text-center">Leads</th>
                    <th className="p-8 text-[10px] font-black text-ash/40 uppercase tracking-widest text-right">Momentum</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-mist/30">
                  {publishedItems.length > 0 ? (
                    publishedItems.slice(0, 10).map((item) => (
                      <tr key={item.id} className="hover:bg-light-grey/20 transition-all group cursor-pointer">
                        <td className="p-8">
                           <div className="text-[14px] font-bold text-dark group-hover:text-cyan transition-colors line-clamp-1">{item.title}</div>
                           <div className="flex items-center gap-2 mt-1">
                              {item.platform === 'Instagram' && <Camera size={10} className="text-ig" />}
                              {item.platform === 'YouTube' && <Video size={10} className="text-yt" />}
                              <span className="text-[9px] font-bold text-ash/40 uppercase tracking-widest">{item.platform}</span>
                           </div>
                        </td>
                        <td className="p-8 text-center text-sm font-bold text-dark">{(item.views || 0).toLocaleString()}</td>
                        <td className="p-8 text-center text-sm font-bold text-dark">
                          {item.views > 0 ? (((item.likes || 0) + (item.comments || 0) + (item.shares || 0)) / item.views * 100).toFixed(1) : 0}%
                        </td>
                        <td className="p-8 text-center">
                           <span className={cn(
                             "px-3 py-1 rounded-full text-[11px] font-black",
                             item.leads > 0 ? "bg-turquoise/10 text-cyan" : "bg-ash/5 text-ash/30"
                           )}>
                             {item.leads || 0}
                           </span>
                        </td>
                        <td className="p-8 text-right">
                           <div className={cn(
                             "flex items-center justify-end gap-2",
                             item.views > 1000 ? "text-turquoise" : "text-ash/20"
                           )}>
                              <TrendingUp size={14} />
                              <span className="text-[10px] font-black uppercase tracking-widest">{item.views > 1000 ? 'High' : 'Steady'}</span>
                           </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-32 text-center text-ash/40 italic font-medium">
                        Deploy content pieces to begin tracking performance intelligence.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="bg-dark text-white p-10 rounded-[40px] shadow-2xl flex flex-col justify-between relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-64 h-64 bg-cyan/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-cyan/20 transition-all duration-700" />
           
           <div className="relative z-10">
             <h3 className="text-2xl font-display font-bold mb-8">Platform Velocity</h3>
             <div className="space-y-10">
                 <PlatformProgress label="Instagram" value={items.filter(i => i.platform === 'Instagram').length} total={items.length} color="ig" />
                 <PlatformProgress label="YouTube" value={items.filter(i => i.platform === 'YouTube').length} total={items.length} color="yt" />
                 <PlatformProgress label="LinkedIn" value={items.filter(i => i.platform === 'LinkedIn').length} total={items.length} color="cyan" />
                 <PlatformProgress label="Twitter/X" value={items.filter(i => i.platform === 'Twitter/X').length} total={items.length} color="cyan" />
                 <PlatformProgress 
                   label="Cross-platform" 
                   value={items.filter(i => ['MULTI', 'Multi-platform', 'Multi'].includes(i.platform)).length} 
                   total={items.length} 
                   color="cyan" 
                   note="Synced across ecosystem"
                 />
                 <PlatformProgress 
                   label="Other" 
                   value={items.filter(i => !['Instagram', 'YouTube', 'LinkedIn', 'Twitter/X', 'MULTI', 'Multi-platform', 'Multi'].includes(i.platform)).length} 
                   total={items.length} 
                   color="cyan" 
                 />
             </div>
           </div>

           <div className="mt-12 p-8 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-xl relative z-10">
              <div className="text-[10px] font-black text-cyan uppercase tracking-[0.3em] mb-2">Primary Driver</div>
              <div className="text-2xl font-display font-bold">
                {items.filter(i => i.platform === 'Instagram').length > (channel?.videoCount || 0) ? 'Instagram' : 'YouTube'}
              </div>
              <p className="text-[11px] text-white/40 mt-2 leading-relaxed">This platform is currently driving a significant portion of your total ecosystem reach.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

const PlatformProgress = ({ label, value, total, color, note }: any) => {
  const percentage = total > 0 ? (value / total) * 100 : 0;
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-baseline">
        <div className="flex flex-col">
          <span className="text-[11px] font-bold uppercase tracking-widest text-white/60">{label}</span>
          {note && <span className="text-[8px] font-medium text-cyan/60 uppercase tracking-tighter mt-0.5">{note}</span>}
        </div>
        <span className="text-sm font-bold text-white">{value} pieces</span>
      </div>
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          className={cn(
            "h-full rounded-full",
            color === 'ig' ? "bg-ig shadow-[0_0_15px_rgba(225,48,108,0.4)]" : 
            color === 'yt' ? "bg-yt shadow-[0_0_15px_rgba(255,0,0,0.4)]" : "bg-cyan shadow-[0_0_15px_rgba(31,142,141,0.4)]"
          )}
        />
      </div>
    </div>
  );
}

const StatCard = ({ label, value, icon: Icon, trend, isPositive, color = 'cyan', customValue }: { label: string, value: number, icon: any, trend: string, isPositive: boolean, color?: string, customValue?: string }) => (
  <motion.div 
    whileHover={{ y: -4 }}
    className="bg-white border border-mist p-10 rounded-[32px] shadow-sm relative overflow-hidden"
  >
    <div className="flex justify-between items-start mb-6">
       <div className={cn(
         "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
         color === 'ig' ? "bg-ig/10 text-ig" : color === 'yt' ? "bg-yt/10 text-yt" : "bg-light-grey text-ash/60"
       )}>
          <Icon size={20} />
       </div>
       <div className={cn(
         "flex items-center gap-1 text-[10px] font-black tracking-tighter",
         isPositive ? "text-turquoise" : "text-red-500"
       )}>
          {isPositive ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
          {trend}
       </div>
    </div>
    <div className="text-4xl lg:text-5xl font-display font-black text-dark tracking-tighter leading-none mb-3">
      {customValue || (value > 999999 ? `${(value / 1000000).toFixed(1)}M` : value > 999 ? `${(value / 1000).toFixed(1)}K` : value)}
    </div>
    <div className="text-[10px] font-bold text-ash/40 uppercase tracking-widest">{label}</div>
  </motion.div>
);
