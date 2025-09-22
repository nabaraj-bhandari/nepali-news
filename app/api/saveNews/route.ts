// app/api/saveNews/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { News } from "@/types/types";

const allowedOrigins = ["https://ekantipur.com", "http://localhost:3000"];

/**
 * Handles OPTIONS preflight request
 */
export async function OPTIONS(req: Request) {
  const origin = req.headers.get("origin") || "";

  if (!allowedOrigins.includes(origin)) {
    return NextResponse.json(
      { error: "CORS not allowed for this origin" },
      { status: 403 },
    );
  }

  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

/**
 * Handles POST request to save news data to MongoDB
 */
export async function POST(req: Request) {
  const origin = req.headers.get("origin") || "";

  // Restrict requests to allowed origins
  if (!allowedOrigins.includes(origin)) {
    return NextResponse.json(
      { error: "CORS not allowed for this origin" },
      { status: 403 },
    );
  }

  try {
    const newsData: News[] = await req.json(); // expecting array of news objects

    if (!Array.isArray(newsData) || newsData.length === 0) {
      return NextResponse.json(
        { error: "No news data provided or invalid format" },
        { status: 400 },
      );
    }

    const client = await clientPromise;
    const db = client.db(); // default DB from MONGO_URI
    const collection = db.collection("news");

    // Insert news items into MongoDB
    const result = await collection.insertMany(newsData);

    return new NextResponse(
      JSON.stringify({
        success: true,
        insertedCount: result.insertedCount,
      }),
      {
        status: 201,
        headers: {
          "Access-Control-Allow-Origin": origin,
        },
      },
    );
  } catch (err) {
    console.error("Error saving news:", err);
    return NextResponse.json({ error: "Failed to save news" }, { status: 500 });
  }
}
