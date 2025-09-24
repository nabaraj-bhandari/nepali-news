// utils/scraper.ts
import axios from "axios";
import * as cheerio from "cheerio";
import Parser from "rss-parser";
import { News, WebScraperConfig } from "@/types/types";
import { SITE_CONFIGS } from "@/config/sources";

const rssParser = new Parser();

async function scrapeSite(
  config: WebScraperConfig,
  limit: number,
): Promise<News[]> {
  try {
    if (config.type === "rss") {
      // RSS scraping
      const feed = await rssParser.parseURL(config.url);
      return (feed.items || [])
        .slice(0, limit)
        .filter((item: any) => item.title && item.title.trim() !== "")
        .map((item: any) => ({
          title: item.title || "No Title",
          url: item.link || "#",
          source: config.name,
        }));
    } else {
      // Web scraping
      const { data } = await axios.get(config.url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0 Safari/537.36",
        },
      });
      const $ = cheerio.load(data);

      return $(config.listSelector || "")
        .slice(0, limit)
        .map((_: number, element: any) => {
          const el = $(element);
          const title = el
            .find(config.titleSelector || "")
            .text()
            .trim();
          const link = el.find(config.linkSelector || "").attr("href");
          if (!title) return null;
          return {
            title,
            url: link ? (config.baseUrl ? config.baseUrl + link : link) : "#",
            source: config.name,
          };
        })
        .get()
        .filter(Boolean);
    }
  } catch (err: any) {
    console.error(`${config.name} scraping failed:`, err.message || err);
    return [];
  }
}

export async function scrapeAll(limit = 5): Promise<News[]> {
  const allNews: News[] = [];
  for (const site of SITE_CONFIGS) {
    const siteNews = await scrapeSite(site, limit);
    allNews.push(...siteNews.reverse());
  }
  return allNews;
}

export async function scrapeAllPerSource(limit = 5): Promise<
  {
    source: string;
    news: News[];
    error?: string;
  }[]
> {
  const results: {
    source: string;
    news: News[];
    error?: string;
  }[] = [];

  for (const site of SITE_CONFIGS) {
    try {
      const siteNews = await scrapeSite(site, limit);
      if (siteNews.length === 0) {
        results.push({
          source: site.name,
          news: [],
          error: "No news found or blocked",
        });
      } else {
        results.push({ source: site.name, news: siteNews });
      }
    } catch (err: any) {
      results.push({
        source: site.name,
        news: [],
        error: err.message || "Scraping failed",
      });
    }
  }

  return results;
}
