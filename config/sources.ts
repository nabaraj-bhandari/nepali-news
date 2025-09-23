import { WebScraperConfig } from "@/types/types";

export const SITE_CONFIGS: WebScraperConfig[] = [
  {
    type: "web",
    name: "The Kathmandu Post",
    url: "https://kathmandupost.com/national",
    baseUrl: "https://kathmandupost.com",
    listSelector: "article",
    titleSelector: "a > h3",
    descSelector: "p",
    linkSelector: "a",
  },
  {
    type: "web",
    name: "Nagarik Dainik",
    url: "https://nagariknews.nagariknetwork.com/main-news",
    baseUrl: "https://nagariknews.nagariknetwork.com",
    listSelector: "article > .text",
    titleSelector: "h1 > a",
    descSelector: "p",
    linkSelector: "h1 > a",
  },
  {
    type: "rss",
    name: "OnlineKhabar",
    url: "https://www.onlinekhabar.com/feed",
    descSelector: "contentSnippet",
    cleanHtml: false,
  },
  {
    type: "rss",
    name: "Rajdhani Daily",
    url: "https://www.rajdhanidaily.com/feed",
    descSelector: "content:encoded",
    cleanHtml: true,
  },
];
