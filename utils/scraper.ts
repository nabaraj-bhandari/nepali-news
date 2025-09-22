import axios from "axios";
import * as cheerio from "cheerio";
import Parser from "rss-parser";
import { News } from "@/types/types";

// Web Scraping
export async function scrapeKathmanduPost(limit = 10): Promise<News[]> {
  try {
    const baseUrl = "https://kathmandupost.com";
    const { data } = await axios.get("https://kathmandupost.com/national");
    const $ = cheerio.load(data);

    const items: News[] = $("article")
      .slice(0, limit)
      .map((_: number, article: any) => {
        const el = $(article);
        return {
          title: el.find("a>h3").text().trim() || "No Title",
          description: el.find("p").text().trim() || "",
          url: baseUrl + el.find("a").attr("href") || "#",
          source: "The Kathmandu Post",
        };
      })
      .get();
    return items;
  } catch (err) {
    console.error("The Kathmandu Post error:", err);
    throw err;
  }
}

// RSS Scraping
const rssParser = new Parser();

export async function scrapeOnlineKhabar(limit = 10): Promise<News[]> {
  try {
    const feed = await rssParser.parseURL("https://www.onlinekhabar.com/feed");
    const items: News[] = (feed.items || [])
      .slice(0, limit)
      .map((item: any) => ({
        title: item.title || "No Title",
        description:
          item.contentSnippet ||
          item.content ||
          item.description ||
          "No description",
        url: item.link || "#",
        source: "OnlineKhabar",
      }));
    return items;
  } catch (err) {
    console.error("OnlineKhabar error:", err);
    throw err;
  }
}

// ScrapeAll

export async function scrapeAll(limit = 10): Promise<News[]> {
  try {
    const onlineKhabarNews = await scrapeOnlineKhabar(limit);
    const kathmanduPostNews = await scrapeKathmanduPost(limit);
    const news = [...onlineKhabarNews, ...kathmanduPostNews];
    return news;
  } catch (err) {
    console.error("News Scraping failed:", err);
    throw err;
  }
}
