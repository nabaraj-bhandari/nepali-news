// app/admin/page.tsx
"use client";

import { useState, useEffect } from "react";
import { News } from "@/types/types";

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

      <button
        onClick={runScraper}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        {loading ? "Scraping..." : "Run Scraper"}
      </button>

      {error && <p className="text-red-500 mt-3">{error}</p>}

      <h2 className="text-xl font-semibold mt-6 mb-3">News in Database</h2>
      <ul className="space-y-2">
        {news.map((item: News) => (
          <li key={item.url} className="border p-3 rounded">
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 font-medium"
            >
              {item.title}
            </a>
            <p className="text-sm text-gray-600">{item.description}</p>
            <p className="text-xs text-gray-400">
              {item.date} - {item.source}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
