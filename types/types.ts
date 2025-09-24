export interface News {
  title: string;
  url: string;
  source: string;
}

export interface RSSConfig {
  type: "rss";
  name: string;
  url: string;
  enabled?: boolean;
}

export interface WebConfig {
  type: "web";
  name: string;
  url: string;
  baseUrl?: string;
  listSelector: string;
  titleSelector: string;
  linkSelector: string;
  enabled?: boolean;
}

export type WebScraperConfig = RSSConfig | WebConfig;
