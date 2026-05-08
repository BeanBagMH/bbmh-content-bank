import type { ContentItem } from '../types';

export const DATA: Partial<ContentItem>[] = [
  {
    id: "1",
    content_type: "Reel",
    title: "They Googled you before the meeting",
    cluster: "Brand Invisibility",
    status: "Published",
    platform: "Instagram",
    priority: "High",
    publish_date: "2024-05-10"
  },
  {
    id: "2",
    content_type: "LinkedIn Post",
    title: "The person who killed your deal has never met you",
    cluster: "Trust Building",
    status: "Scripting",
    platform: "LinkedIn",
    priority: "Medium",
    publish_date: "2024-05-12"
  }
];

export const SCRIPTS: Record<string, any> = {
  "1": {
    hook: "Your client decided before you walked in. Not in the meeting — on Google, three days before it.",
    cta: "Drop AUDIT in the comments.",
  }
};
