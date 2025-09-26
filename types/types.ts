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

export interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userSources: string[];
  setUserSources: (sources: string[]) => void;
}

export interface ScrapeResult {
  source: string;
  status: "success" | "error";
  message: string;
}

export interface ScrapeLog {
  source: string;
  status: "success" | "error";
  message: string;
}

export interface SourceSelectorProps {
  selectedSource: string;
  setSelectedSource: (source: string) => void;
  userSources: string[];
}
