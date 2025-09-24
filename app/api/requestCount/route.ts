// app/api/requestCount/route.ts

import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

const COUNTER_ID = "globalCount";
const THRESHOLD = 9;

interface RequestCounter {
  _id: string;
  count: number;
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection<RequestCounter>("requestCounter");

    const counter = await collection.findOne({ _id: COUNTER_ID });

    return NextResponse.json({ count: counter?.count ?? 0 }, { status: 200 });
  } catch (err) {
    console.error("GET /api/requestCount error:", err);
    return NextResponse.json({ count: 0 }, { status: 500 });
  }
}
export async function POST() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection<RequestCounter>("requestCounter");

    const updatedDoc = await collection.findOneAndUpdate(
      { _id: COUNTER_ID },
      { $inc: { count: 1 } },
      { upsert: true, returnDocument: "after" },
    );

    const newCount = updatedDoc?.count ?? 0;

    if (newCount >= THRESHOLD) {
      await collection.updateOne({ _id: COUNTER_ID }, { $set: { count: 0 } });
      import("@/utils/helperFunctions").then((mod) => mod.runScraper());
    }

    return NextResponse.json({ count: newCount }, { status: 200 });
  } catch (err) {
    console.error("POST /api/requestCount error:", err);
    return NextResponse.json({ count: 0 }, { status: 500 });
  }
}
