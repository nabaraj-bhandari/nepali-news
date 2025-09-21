import { scrapeEkantipur } from "@/utils/scraper";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    return NextResponse.json(await scrapeEkantipur());
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json(
        { error: "Failed to fetch news", details: err.message },
        { status: 500 },
      );
    }
    return NextResponse.json(
      { error: "Unknown error occured" },
      { status: 500 },
    );
  }
}
