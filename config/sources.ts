import { WebScraperConfig } from "@/types/types";

export const SITE_CONFIGS: WebScraperConfig[] = [
  // Web
  {
    type: "web",
    name: "The Kathmandu Post",
    url: "https://kathmandupost.com/national",
    baseUrl: "https://kathmandupost.com",
    listSelector: "div > article",
    titleSelector: "a > h3",
    linkSelector: "a",
  },
  {
    type: "web",
    name: "Nagarik Dainik",
    url: "https://nagariknews.nagariknetwork.com/main-news",
    baseUrl: "https://nagariknews.nagariknetwork.com",
    listSelector: "article > .text",
    titleSelector: "h1 > a",
    linkSelector: "h1 > a",
  },
  {
    type: "web",
    name: "eKantipur",
    url: "https://ekantipur.com",
    listSelector: "div > article",
    titleSelector: "h2 > a,h1 > a",
    linkSelector: "h2 > a,h1 > a",
  },
  {
    type: "web",
    name: "Gorkapatra",
    url: "https://gorkhapatraonline.com/categories/national",
    listSelector: "section > div > div > div > div > div > div > div",
    titleSelector: "div > h2 > a",
    linkSelector: "div > h2 > a",
  },

  // RSS
  {
    type: "rss",
    name: "OnlineKhabar",
    url: "https://www.onlinekhabar.com/feed",
  },
  {
    type: "rss",
    name: "Rajdhani Daily",
    url: "https://www.rajdhanidaily.com/feed",
  },
  {
    type: "rss",
    name: "News24 Nepal",
    url: "https://www.news24nepal.com/feed",
  },
  {
    type: "rss",
    name: "OS Nepal",
    url: "https://www.osnepal.com/feed",
  },
  {
    type: "rss",
    name: "Ratopati",
    url: "https://www.ratopati.com/feed",
  },
  {
    type: "rss",
    name: "Setopati",
    url: "https://www.setopati.com/feed",
  },
  {
    type: "rss",
    name: "Artha Sarokar",
    url: "https://www.arthasarokar.com/feed",
  },
  {
    type: "rss",
    name: "Nepal Samaya",
    url: "https://www.nepalsamaya.com/feed",
  },
];
