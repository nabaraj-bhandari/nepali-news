// utils/helperFunctions.ts

export const runScraper = async () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  try {
    const res = await fetch(`${baseUrl}/api/scrapeNews`, { method: "POST" });
    const data = await res.json();

    if (!res.ok) throw new Error(data.error || "Scraping failed");

    console.log(`Scraped ${data.total} items. Inserted: ${data.inserted}`);
  } catch (err) {
    console.error("Scraper error:", err);
  }
};
