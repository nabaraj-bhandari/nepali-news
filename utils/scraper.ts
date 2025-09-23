import axios from "axios";
import * as cheerio from "cheerio";
import Parser from "rss-parser";
import { News } from "@/types/types";

const rssParser = new Parser();

// --- Utility: Split text into bullet points ---
const getBulletPoints = (text: string): string[] => {
  if (!text) return [];
  return text
    .split(/\s*(?<!\d)[।.!?](?!\d)\s*/) // Split by Nepali/English sentence end
    .map((s) => s.trim())
    .filter(Boolean);
};

// --- Utility: Clean unwanted HTML from RSS ---
const cleanHtmlText = (html: string): string => {
  const $ = cheerio.load(html || "");
  $("p").last().remove(); // remove last <p> (metadata)
  return $.text().trim();
};

// --- Config type ---
type WebScraperConfig = {
  type: "rss" | "web";
  name: string;
  url: string;
  baseUrl?: string;
  listSelector?: string;
  titleSelector?: string;
  descSelector?: string; // for WEB: CSS selector | for RSS: field name
  linkSelector?: string;
  cleanHtml?: boolean;
};

// --- All site configs here ---
const SITE_CONFIGS: WebScraperConfig[] = [
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
    descSelector: "contentSnippet", // correct field name
    cleanHtml: false,
  },
  {
    type: "rss",
    name: "Rajdhani Daily",
    url: "https://www.rajdhanidaily.com/feed",
    descSelector: "content:encoded", // correct field name
    cleanHtml: true,
  },
];

async function scrapeSite(
  config: WebScraperConfig,
  limit = 10,
): Promise<News[]> {
  try {
    if (config.type === "rss") {
      // --- RSS Scraping ---
      const feed = await rssParser.parseURL(config.url);

      return (feed.items || []).slice(0, limit).map((item: any) => {
        // Get the actual content dynamically using the field name
        const rawContent = item[config.descSelector || "description"] || "";

        const finalText = config.cleanHtml
          ? cleanHtmlText(rawContent)
          : rawContent;

        return {
          title: item.title || "No Title",
          description: getBulletPoints(finalText),
          url: item.link || "#",
          source: config.name,
        };
      });
    } else {
      // --- Web Scraping ---
      const { data } = await axios.get(config.url);
      const $ = cheerio.load(data);

      return $(config.listSelector || "")
        .slice(0, limit)
        .map((_: number, element: any) => {
          const el = $(element);
          const title = el
            .find(config.titleSelector || "")
            .text()
            .trim();
          const desc = el
            .find(config.descSelector || "")
            .text()
            .trim();
          const link = el.find(config.linkSelector || "").attr("href");

          return {
            title: title || "No Title",
            description: getBulletPoints(desc),
            url: link ? (config.baseUrl ? config.baseUrl + link : link) : "#",
            source: config.name,
          };
        })
        .get();
    }
  } catch (err) {
    console.error(`${config.name} scraping failed:`, err);
    return [];
  }
}

// --- Master function to scrape all sources ---
export async function scrapeAll(limit = 10): Promise<News[]> {
  const allNews: News[] = [];

  for (const site of SITE_CONFIGS) {
    const siteNews = await scrapeSite(site, limit);
    allNews.push(...siteNews);
  }

  return allNews;
}
