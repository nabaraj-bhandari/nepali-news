import axios from "axios";
import * as cheerio from "cheerio";
import Parser from "rss-parser";
import { News } from "@/types/types";

// Get Bullet Points
const getBulletPoints = (text: string) => {
  if (!text) return [];
  let sentences = text
    .split(/\s*(?<!\d)[।.!?](?!\d)\s*/)
    .map((s) => s.trim())
    .filter(Boolean);
  return sentences;
};

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
          description: getBulletPoints(el.find("p").text().trim()) || [],
          url: el.find("a").attr("href")
            ? baseUrl + el.find("a").attr("href")
            : "#",
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

export async function scrapeNagarikDainik(limit = 10): Promise<News[]> {
  try {
    const baseUrl = "https://nagariknews.nagariknetwork.com";
    const { data } = await axios.get(
      "https://nagariknews.nagariknetwork.com/main-news",
    );
    const $ = cheerio.load(data);

    const items: News[] = $("article>.text")
      .slice(0, limit)
      .map((_: number, article: any) => {
        const el = $(article);
        return {
          title: el.find("h1 > a").text().trim() || "No Title",
          description: getBulletPoints(el.find("p").text().trim()) || [],
          url: baseUrl + el.find("h1 > a").attr("href") || "#",
          source: "Nagarik Dainik",
        };
      })
      .get();
    return items;
  } catch (err) {
    console.error("Nagarik Dainik error:", err);
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
          getBulletPoints(
            item.contentSnippet || item.content || item.description,
          ) || [],
        url: item.link || "#",
        source: "OnlineKhabar",
      }));
    return items;
  } catch (err) {
    console.error("OnlineKhabar error:", err);
    throw err;
  }
}

export async function scrapeRajdhaniDaily(limit = 10): Promise<News[]> {
  try {
    const feed = await rssParser.parseURL("https://www.rajdhanidaily.com/feed");

    const items: News[] = (feed.items || [])
      .slice(0, limit)
      .map((item: any) => {
        const rawHtml =
          item["content:encoded"] || item.content || item.description;
        const $ = cheerio.load(rawHtml || "");
        $("p").last().remove();
        const cleanText = $.text().trim();

        return {
          title: item.title || "No Title",
          description: getBulletPoints(cleanText),
          url: item.link || "#",
          source: "Rajdhani Daily",
        };
      });

    return items;
  } catch (err) {
    console.error("Rajdhani Daily error:", err);
    throw err;
  }
}

// ScrapeAll
export async function scrapeAll(limit = 10): Promise<News[]> {
  const news: News[] = [];

  try {
    news.push(...(await scrapeKathmanduPost(limit)));
  } catch (err) {
    console.error("Kathmandu Post failed", err);
  }
  try {
    news.push(...(await scrapeNagarikDainik(limit)));
  } catch (err) {
    console.error("Nagarik Dainik failed", err);
  }
  try {
    news.push(...(await scrapeOnlineKhabar(limit)));
  } catch (err) {
    console.error("Online Khabar failed", err);
  }
  try {
    news.push(...(await scrapeRajdhaniDaily(limit)));
  } catch (err) {
    console.error("Rajdhani Daily failed", err);
  }

  return news;
}
