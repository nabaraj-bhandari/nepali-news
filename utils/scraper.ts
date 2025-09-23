import axios from "axios";
import * as cheerio from "cheerio";
import Parser from "rss-parser";
import { News } from "@/types/types";

import { getBulletPoints, cleanHtmlText } from "./helperFunctions";
import { WebScraperConfig } from "@/types/types";
import { SITE_CONFIGS } from "@/config/sources";

const rssParser = new Parser();

async function scrapeSite(
  config: WebScraperConfig,
  limit = 10,
): Promise<News[]> {
  try {
    if (config.type === "rss") {
      // RSS
      const feed = await rssParser.parseURL(config.url);

      return (feed.items || []).slice(0, limit).map((item: any) => {
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
      // Web
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

export async function scrapeAll(limit = 10): Promise<News[]> {
  const allNews: News[] = [];

  for (const site of SITE_CONFIGS) {
    const siteNews = await scrapeSite(site, limit);
    const sorted = siteNews.reverse();
    allNews.push(...sorted);
  }

  return allNews;
}
