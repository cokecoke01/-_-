export type IconType = 'github' | 'google' | 'blog' | 'portfolio' | 'instagram' | 'youtube' | 'custom';

export interface UserProfile {
  name: string;
  username: string;
  bio: string;
  tagline: string;
  email: string;
  avatar: string;
}

export interface LinkItem {
  id: string;
  title: string;
  url: string;
  icon: IconType;
  description?: string;
  clicks: number;
  order: number;
  createdAt: string;
}

export interface DailyTrend {
  date: string;
  label: string;
  visits: number;
  clicks: number;
}

export interface LinkStat {
  id: string;
  title: string;
  url: string;
  icon: IconType;
  clicks: number;
  percentage: number;
}

export interface StatsData {
  totalVisits: number;
  totalClicks: number;
  uniqueVisitors: number;
  mostClickedLink: LinkItem | null;
  linkStats: LinkStat[];
  dailyTrend: DailyTrend[];
}
