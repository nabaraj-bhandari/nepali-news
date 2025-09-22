// app/api/scrapeNews/route.ts

import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { scrapeAll } from "@/utils/scraper";
import { News } from "@/types/types";

export async function POST() {
  try {
    const newsData: News[] = await scrapeAll(5);

    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("news");

    // Prevent duplicates using `url` as unique identifier
    const operations = newsData.map((item) => ({
      updateOne: {
        filter: { url: item.url },
        update: { $set: item },
        upsert: true,
      },
    }));

    const result = await collection.bulkWrite(operations, { ordered: false });

    return NextResponse.json({
      success: true,
      message: "Scraping completed successfully",
      inserted: result.upsertedCount,
      modified: result.modifiedCount,
      total: newsData.length,
    });
  } catch (err) {
    console.error("Scraper Error:", err);
    return NextResponse.json({ error: "Scraping failed" }, { status: 500 });
  }
}
