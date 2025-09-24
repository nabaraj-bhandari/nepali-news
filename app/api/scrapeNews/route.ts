// app/api/scrapeNews/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { scrapeAllPerSource } from "@/utils/scraper";
import { News, ScrapeResult } from "@/types/types";

async function runScraper(): Promise<{
  total: number;
  inserted: number;
  logs: ScrapeResult[];
  error?: string;
}> {
  const logs: ScrapeResult[] = [];
  let allNews: News[] = [];

  try {
    const results = await scrapeAllPerSource(40);

    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("news");

    for (const result of results) {
      const { source, news, error } = result;

      if (error) {
        logs.push({ source, status: "error", message: error });
        continue;
      }

      if (!news || news.length === 0) {
        logs.push({ source, status: "success", message: "No news found" });
        continue;
      }

      const operations = news.map((item: News) => ({
        updateOne: {
          filter: { url: item.url },
          update: { $set: item },
          upsert: true,
        },
      }));

      const dbResult = await collection.bulkWrite(operations, {
        ordered: false,
      });

      logs.push({
        source,
        status: "success",
        message: `Scraped ${news.length} items, Inserted: ${dbResult.upsertedCount}, Modified: ${dbResult.modifiedCount}`,
      });

      allNews = allNews.concat(news);
    }

    return {
      total: allNews.length,
      inserted: logs.reduce(
        (sum, log) =>
          log.status === "success"
            ? sum + parseInt(log.message.match(/Inserted: (\d+)/)?.[1] || "0")
            : sum,
        0,
      ),
      logs,
    };
  } catch (err) {
    console.error("[Scraper] Error:", err);
    return { total: 0, inserted: 0, logs, error: "Scraping failed" };
  }
}

export async function POST() {
  const result = await runScraper();

  if (result.error) {
    return NextResponse.json(result, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    message: "Scraper run manually",
    ...result,
  });
}
