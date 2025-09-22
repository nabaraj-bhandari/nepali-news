// app/admin/page.tsx
"use client";

import { useState, useEffect } from "react";
import { News } from "@/types/types";
import NewsCard from "@/components/NewsCard";

export default function AdminPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch news from DB
  const fetchNews = async () => {
    try {
      const res = await fetch("/api/getNews");
      if (!res.ok) throw new Error("Failed to fetch news");
      const data = await res.json();
      setNews(data || []);
    } catch (err: unknown) {
      console.error(err);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unknown error");
      }
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // Trigger scraping
  const runScraper = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/scrapeNews", { method: "POST" });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Scraping failed");

      alert(`Scraped ${data.total} items. Inserted: ${data.inserted}`);
      fetchNews();
    } catch (err: unknown) {
      console.error(err);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unknown error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      <div className="flex space-x-4">
        {/* Existing Run Scraper Button */}
        <button
          onClick={runScraper}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 hover:bg-blue-700 transition"
        >
          {loading ? "Scraping..." : "Run Scraper"}
        </button>

        {/* New Button to Open Ekantipur in Background */}
        <button
          onClick={() =>
            window.open(
              "https://ekantipur.com/headlines",
              "_blank",
              "noopener,noreferrer",
            )
          }
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Open Ekantipur
        </button>
      </div>

      {error && <p className="text-red-500 mt-3">{error}</p>}

      <h2 className="text-xl font-semibold mt-6 mb-3">News in Database</h2>
      <ul className="space-y-2">
        {news.length === 0 ? (
          <div className="text-center text-gray-500 text-lg">
            No news available.
          </div>
        ) : (
          <div className="space-y-6">
            {news.map((item: News, index: number) => (
              <NewsCard key={index} news={item} />
            ))}
          </div>
        )}
      </ul>
    </div>
  );
}
