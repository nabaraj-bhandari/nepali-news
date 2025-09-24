// app/admin/page.tsx
"use client";
import { useState } from "react";
import { ScrapeLog } from "@/types/types";

export default function AdminPage() {
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<ScrapeLog[]>([]);
  const [error, setError] = useState<string | null>(null);

  const runScraper = async () => {
    setLoading(true);
    setError(null);
    setLogs([]);

    try {
      const res = await fetch("/api/scrapeNews", { method: "POST" });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Scraping failed");

      // Add logs from API if available
      if (data.logs && Array.isArray(data.logs)) {
        setLogs(data.logs);
      } else {
        setLogs([
          {
            source: "All",
            status: "success",
            message: `Scraped ${data.total} items. Inserted: ${data.inserted}`,
          },
        ]);
      }
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError(msg);
      setLogs((prev) => [
        ...prev,
        { source: "All", status: "error", message: msg },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      <div className="flex space-x-4 justify-center mb-4">
        <button
          onClick={runScraper}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 hover:bg-blue-700 transition"
        >
          {loading ? "Scraping..." : "Run Scraper"}
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 max-h-[400px] overflow-y-auto">
        {logs.length === 0 && !loading && (
          <p className="text-gray-500">No logs yet.</p>
        )}

        {logs.map((log, idx) => (
          <div
            key={idx}
            className={`mb-2 text-sm ${
              log.status === "success"
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            <strong>{log.source}:</strong> {log.message}
          </div>
        ))}
      </div>
    </div>
  );
}
