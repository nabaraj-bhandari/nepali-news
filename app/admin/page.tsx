"use client";

import { useState, useEffect } from "react";
import { News } from "@/types/types";

export default function AdminPage() {
  const [newsList, setNewsList] = useState<News[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchNewsFromDB = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/getNews"); // we'll create this endpoint
      if (!res.ok) throw new Error("Failed to fetch news");
      const data: News[] = await res.json();
      setNewsList(data);
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

  useEffect(() => {
    fetchNewsFromDB();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Panel - News from DB</h1>

      <button
        onClick={fetchNewsFromDB}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
        Refresh News
      </button>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {newsList.length === 0 && !loading && (
        <p className="text-gray-600">No news in DB.</p>
      )}

      <div className="space-y-4">
        {newsList.map((item, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg p-4 shadow-sm"
          >
            <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
            <div className="text-sm text-gray-500 mb-2">
              {item.date} | Source: {item.source}
            </div>
            <p className="text-gray-700">{item.description}</p>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline text-sm"
            >
              Read more →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
