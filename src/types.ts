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

export interface SearchQueryStat {
  query: string;
  impressions: number;
  clicks: number;
  ctr: number;
  position: number;
}

export interface TrafficSourceStat {
  source: string;
  visits: number;
  percentage: number;
  color: string;
}

export interface GoogleSearchData {
  totalImpressions: number;
  organicClicks: number;
  searchCtr: number;
  avgPosition: number;
  topQueries: SearchQueryStat[];
  trafficSources: TrafficSourceStat[];
  indexingStatus: {
    isIndexed: boolean;
    crawler: string;
    mobileUsability: string;
    coreWebVitals: string;
    schemaMarkup: string;
  };
}

export interface StatsData {
  totalVisits: number;
  totalClicks: number;
  uniqueVisitors: number;
  mostClickedLink: LinkItem | null;
  linkStats: LinkStat[];
  dailyTrend: DailyTrend[];
  googleSearch?: GoogleSearchData;
}
