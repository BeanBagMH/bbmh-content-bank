import { useState, useEffect } from 'react';

const CHANNEL_ID = 'UCGaQREZ0zbw2H90xQUaJGig';
const BASE = 'https://www.googleapis.com/youtube/v3';

export interface YouTubeChannelStats {
  subscribers: number;
  totalViews: number;
  videoCount: number;
  channelTitle: string;
  channelThumb: string;
}

export interface YouTubeVideoStats {
  id: string;
  title: string;
  thumbnail: string;
  views: number;
  likes: number;
  comments: number;
  publishedAt: string;
  duration: string;
}

export function useYouTubeStats() {
  const [channel, setChannel] = useState<YouTubeChannelStats | null>(null);
  const [videos, setVideos] = useState<YouTubeVideoStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = async () => {
    const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
    
    if (!apiKey) {
      setError('YouTube API key not found in environment');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Fetch channel stats
      const chanRes = await fetch(
        `${BASE}/channels?part=statistics,snippet&id=${CHANNEL_ID}&key=${apiKey}`
      );
      const chanData = await chanRes.json();

      if (chanData.error) {
        throw new Error(`YouTube API error: ${chanData.error.message}`);
      }

      const ch = chanData.items?.[0];
      if (!ch) { 
        throw new Error('Channel not found');
      }

      setChannel({
        subscribers:  parseInt(ch.statistics.subscriberCount || '0'),
        totalViews:   parseInt(ch.statistics.viewCount || '0'),
        videoCount:   parseInt(ch.statistics.videoCount || '0'),
        channelTitle: ch.snippet.title,
        channelThumb: ch.snippet.thumbnails?.default?.url || '',
      });

      // 2. Fetch recent videos list
      const searchRes = await fetch(
        `${BASE}/search?part=snippet&channelId=${CHANNEL_ID}&type=video&order=date&maxResults=10&key=${apiKey}`
      );
      const searchData = await searchRes.json();
      const videoIds = searchData.items?.map((v: any) => v.id.videoId).join(',') || '';

      if (!videoIds) { 
        setLoading(false); 
        return; 
      }

      // 3. Fetch detailed stats for each video
      const videoRes = await fetch(
        `${BASE}/videos?part=statistics,snippet,contentDetails&id=${videoIds}&key=${apiKey}`
      );
      const videoData = await videoRes.json();

      const parsed: YouTubeVideoStats[] = (videoData.items || []).map((v: any) => ({
        id:          v.id,
        title:       v.snippet.title,
        thumbnail:   v.snippet.thumbnails?.medium?.url || '',
        views:       parseInt(v.statistics.viewCount || '0'),
        likes:       parseInt(v.statistics.likeCount || '0'),
        comments:    parseInt(v.statistics.commentCount || '0'),
        publishedAt: v.snippet.publishedAt,
        duration:    v.contentDetails.duration,
      }));

      setVideos(parsed);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return { channel, videos, loading, error, refresh: fetchAll };
}
