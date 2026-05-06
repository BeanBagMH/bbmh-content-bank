export type ContentColumn = 'video' | 'blog' | 'social';
export type ContentStatus = 'Script Ready' | 'Draft';
export type ContentFormat = 'Deep Reel' | 'Carousel' | 'Wide Short' | 'Long Form';

export interface ContentItem {
  id: number;
  col: ContentColumn;
  title: string;
  cluster: string;
  cname: string;
  fmt: ContentFormat;
  status: ContentStatus;
  hasScript: boolean;
  day?: number;
  month?: number;
  year?: number;
}

export interface Script {
  hook: string;
  empathy: string;
  insight: string;
  reframe: string;
  newworld: string;
  cta?: string;
  framework: string;
  director: string;
}
