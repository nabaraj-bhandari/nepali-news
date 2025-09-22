// app/api/scrapeNews/route.ts

import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { scrapeAll } from "@/utils/scraper";
import { News } from "@/types/types";

let scraperInitialized = false;

// Core scraping function
async function runScraper() {
  try {
    const newsData: News[] = await scrapeAll(5);

    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("news");

    const operations = newsData.map((item) => ({
      updateOne: {
        filter: { url: item.url },
        update: { $set: item },
        upsert: true,
      },
    }));

    const result = await collection.bulkWrite(operations, { ordered: false });
    console.log(
      `[Scraper] Total: ${newsData.length}, Inserted: ${result.upsertedCount}, Modified: ${result.modifiedCount}`,
    );
    return { total: newsData.length, inserted: result.upsertedCount };
  } catch (err) {
    console.error("[Scraper] Error:", err);
    return { error: "Scraping failed" };
  }
}

// Auto-run every 10 minutes (only on persistent Node server)
if (!scraperInitialized) {
  scraperInitialized = true;
  runScraper();
  setInterval(runScraper, 10 * 60 * 1000);
}

// API POST endpoint for manual trigger
export async function POST() {
  const result = await runScraper();
  if ("error" in result) {
    return NextResponse.json(result, { status: 500 });
  }
  return NextResponse.json({
    success: true,
    message: "Scraper run manually",
    ...result,
  });
}
