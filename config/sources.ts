import { WebScraperConfig } from "@/types/types";

export const SITE_CONFIGS: WebScraperConfig[] = [
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
    url: "https://arthasarokar.com/feed",
  },
  {
    type: "rss",
    name: "Nepal Samaya",
    url: "https://nepalsamaya.com/feed",
  },
  {
    type: "rss",
    name: "Nepali Patra",
    url: "https://www.nepalipatra.com/feed",
  },
  {
    type: "rss",
    name: "१२खरी",
    url: "https://baahrakhari.com/feed",
  },
  {
    type: "rss",
    name: "लोकान्तर",
    url: "https://lokaantar.com/feed",
  },

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
    name: "The Rising Nepal",
    url: "https://risingnepaldaily.com/categories/nation",
    listSelector: ".item-content",
    titleSelector: "h2 > a",
    linkSelector: "h2 > a",
  },

  {
    type: "web",
    name: "Gorkapatra",
    url: "https://gorkhapatraonline.com/categories/national",
    listSelector: ".item-content",
    titleSelector: "h2 > a",
    linkSelector: "h2 > a",
  },
  {
    type: "web",
    name: "Aarthik News",
    url: "https://aarthiknews.com",
    baseUrl: "https://aarthiknews.com",
    listSelector: ".top__stories-grid > .grid__card > .card__details",
    titleSelector: "h3 > a",
    linkSelector: "h3 > a",
  },
];
