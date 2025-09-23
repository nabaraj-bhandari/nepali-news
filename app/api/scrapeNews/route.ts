// app/api/scrapeNews/route.ts

import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { scrapeAll } from "@/utils/scraper";
import { News } from "@/types/types";

async function runScraper() {
  try {
    const newsData: News[] = await scrapeAll(10);

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
