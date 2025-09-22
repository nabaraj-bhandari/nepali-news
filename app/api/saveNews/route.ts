// app/api/saveNews/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { News } from "@/types/types";

const allowedOrigins = ["https://ekantipur.com", "http://localhost:3000"];

export async function POST(req: Request) {
  try {
    const origin = req.headers.get("origin") || "";

    // Reject requests from disallowed origins
    if (!allowedOrigins.includes(origin)) {
      return new NextResponse(JSON.stringify({ error: "Origin not allowed" }), {
        status: 403,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": origin || "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    const newsData: News[] = await req.json();

    if (!Array.isArray(newsData) || newsData.length === 0) {
      return new NextResponse(
        JSON.stringify({ error: "No news data provided or invalid format" }),
        {
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": origin,
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
          },
        },
      );
    }

    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("news");

    // Upsert using bulkWrite
    const operations = newsData.map((item) => ({
      updateOne: {
        filter: { url: item.url },
        update: { $set: item },
        upsert: true,
      },
    }));

    const result = await collection.bulkWrite(operations, { ordered: false });

    return new NextResponse(
      JSON.stringify({
        success: true,
        inserted: result.upsertedCount,
        modified: result.modifiedCount,
      }),
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": origin,
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      },
    );
  } catch (err) {
    console.error("Error saving news:", err);
    return new NextResponse(JSON.stringify({ error: "Failed to save news" }), {
      status: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }
}

// ✅ Handle preflight requests for CORS
export async function OPTIONS(req: Request) {
  const origin = req.headers.get("origin") || "";

  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": allowedOrigins.includes(origin)
        ? origin
        : "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
