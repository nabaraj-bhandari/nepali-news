// app/admin/page.tsx

"use client";
import { useState } from "react";
export default function AdminPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runScraper = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/scrapeNews", { method: "POST" });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Scraping failed");

      alert(`Scraped ${data.total} items. Inserted: ${data.inserted}`);
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

      <div className="flex space-x-4 justify-center">
        <button
          onClick={runScraper}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 hover:bg-blue-700 transition"
        >
          {loading ? "Scraping..." : "Run Scraper"}
        </button>
      </div>

      {error && <p className="text-red-500 mt-3">{error}</p>}
    </div>
  );
}
