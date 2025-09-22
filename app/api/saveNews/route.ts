// app/api/saveNews/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { News } from "@/types/types";

export async function POST(req: Request) {
  try {
    const newsData: News[] = await req.json(); // expecting array of news objects

    if (!Array.isArray(newsData) || newsData.length === 0) {
      return NextResponse.json(
        { error: "No news data provided or invalid format" },
        { status: 400 },
      );
    }

    const client = await clientPromise;
    const db = client.db(); // use default DB from MONGO_URI
    const collection = db.collection("news");

    // Insert many news items
    const result = await collection.insertMany(newsData);

    return NextResponse.json({
      success: true,
      insertedCount: result.insertedCount,
    });
  } catch (err) {
    console.error("Error saving news:", err);
    return NextResponse.json({ error: "Failed to save news" }, { status: 500 });
  }
}
