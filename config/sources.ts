// config/sources.ts

import { WebScraperConfig } from "@/types/types";

export const DEFAULT_SOURCE_NAMES = [
  "OnlineKhabar",
  "Ratopati",
  "Lokaantar",
  "12 Khari",
  "News24 Nepal",
];

export const RSS_SOURCES: WebScraperConfig[] = [
  {
    type: "rss",
    name: "OnlineKhabar",
    url: "https://www.onlinekhabar.com/feed",
    enabled: true,
  },
  {
    type: "rss",
    name: "Rajdhani Daily",
    url: "https://www.rajdhanidaily.com/feed",
    enabled: true,
  },
  {
    type: "rss",
    name: "News24 Nepal",
    url: "https://www.news24nepal.com/feed",
    enabled: true,
  },
  {
    type: "rss",
    name: "OS Nepal",
    url: "https://www.osnepal.com/feed",
    enabled: true,
  },
  {
    type: "rss",
    name: "Ratopati",
    url: "https://www.ratopati.com/feed",
    enabled: true,
  },
  {
    type: "rss",
    name: "Setopati",
    url: "https://www.setopati.com/feed",
    enabled: true,
  },
  {
    type: "rss",
    name: "Artha Sarokar",
    url: "https://arthasarokar.com/feed",
    enabled: true,
  },
  {
    type: "rss",
    name: "Nepali Patra",
    url: "https://www.nepalipatra.com/feed",
    enabled: true,
  },
  {
    type: "rss",
    name: "12 Khari",
    url: "https://baahrakhari.com/feed",
    enabled: true,
  },
  {
    type: "rss",
    name: "Lokaantar",
    url: "https://lokaantar.com/feed",
    enabled: true,
  },
];

export const SITE_CONFIGS: WebScraperConfig[] = [
  ...RSS_SOURCES.filter((site) => site.enabled),
];
