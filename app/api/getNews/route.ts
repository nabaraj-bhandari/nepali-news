import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { News } from "@/types/types";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection<News>("news");

    const news = await collection
      .find({})
      .sort({ _id: -1 }) // latest first
      .limit(50) // limit to 50 items
      .toArray();

    return NextResponse.json(news);
  } catch (err) {
    console.error("Error fetching news:", err);
    return NextResponse.json(
      { error: "Failed to fetch news" },
      { status: 500 },
    );
  }
}
