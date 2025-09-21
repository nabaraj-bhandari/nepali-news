import { scrapeEkantipur } from "@/public/utils/scraper";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    return NextResponse.json(await scrapeEkantipur());
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch news" },
      { status: 500 },
    );
  }
}
