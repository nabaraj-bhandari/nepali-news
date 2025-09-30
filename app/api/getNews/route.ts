// app/api/getNews/route.ts

import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { News } from "@/types/types";

export async function GET(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection<News>("news");

    const { searchParams } = new URL(req.url);
    const source = searchParams.get("source");

    const query = source ? { source } : {};

    const news = await collection
      .find(query)
      .sort({ _id: -1 })
      .limit(30)
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
