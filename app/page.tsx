// app/page.tsx
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import NewsCard from "@/components/NewsCard";
import SourceSelector from "@/components/SourceSelector";
import SettingsModal from "@/components/SettingsModal";
import { News } from "@/types/types";
import { SITE_CONFIGS } from "@/config/sources";
import { RefreshCw, Settings, Heart } from "lucide-react";

export default function HomePage() {
  const defaultSource = SITE_CONFIGS[0]?.name || "";

  const [selectedSource, setSelectedSource] = useState(defaultSource);
  const [newsCache, setNewsCache] = useState<Record<string, News[]>>({});
  const [loading, setLoading] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const [userSources, setUserSources] = useState<string[]>([]);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const allSources = useMemo(() => SITE_CONFIGS.map((s) => s.name), []);

  // Load data on mount
  useEffect(() => {
    const storedSelected = sessionStorage.getItem("selectedSource");
    const storedCache = sessionStorage.getItem("newsCache");
    const storedUserSources = localStorage.getItem("userSources");

    if (storedSelected) setSelectedSource(storedSelected);
    if (storedCache) setNewsCache(JSON.parse(storedCache));

    if (storedUserSources) {
      setUserSources(JSON.parse(storedUserSources));
    } else {
      setUserSources(allSources);
      localStorage.setItem("userSources", JSON.stringify(allSources));
    }

    setHydrated(true);
  }, [allSources]);

  // Persist state
  useEffect(() => {
    if (!hydrated) return;
    sessionStorage.setItem("selectedSource", selectedSource);
    sessionStorage.setItem("newsCache", JSON.stringify(newsCache));
  }, [selectedSource, newsCache, hydrated]);

  // Keep selectedSource valid
  useEffect(() => {
    if (userSources.length === 0) {
      setSelectedSource("");
    } else if (!userSources.includes(selectedSource)) {
      setSelectedSource(userSources[0]);
    }
  }, [userSources, selectedSource]);

  // Fetch news for a source
  const fetchNewsForSource = useCallback(
    async (source: string, forceRefresh = false) => {
      if (!source) return;
      if (!forceRefresh && newsCache[source]) return;

      try {
        setLoading(true);
        const res = await fetch(
          `/api/getNews?source=${encodeURIComponent(source)}`,
          { cache: "no-store" },
        );
        if (!res.ok) throw new Error("Failed to fetch news");

        const data = await res.json();
        setNewsCache((prev) => ({ ...prev, [source]: data }));
      } catch (err) {
        console.error("Error fetching news for", source, err);
      } finally {
        setLoading(false);
      }
    },
    [newsCache],
  );

  const refreshAllSources = useCallback(async () => {
    if (userSources.length === 0) return;
    setLoading(true);

    const promises = userSources.map((source) =>
      fetchNewsForSource(source, true),
    );

    try {
      await Promise.all(promises);
    } catch (err) {
      console.error("Error refreshing all sources:", err);
    } finally {
      setLoading(false);
    }
  }, [userSources, fetchNewsForSource]);

  // Fetch news when tab changes
  useEffect(() => {
    if (hydrated && selectedSource && userSources.includes(selectedSource)) {
      fetchNewsForSource(selectedSource);
    }
  }, [hydrated, selectedSource, userSources, fetchNewsForSource]);

  if (!hydrated) return null;

  const currentNews = newsCache[selectedSource] || [];

  return (
    <main className="max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight pb-2 pt-4">
          हाम्रो नेपाली न्युज
        </h1>

        <div className="flex gap-2 items-center">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={refreshAllSources}
            title="Refresh Current"
          >
            <RefreshCw className="w-5 h-5" />
          </button>

          <button
            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
            onClick={() => setSettingsOpen(true)}
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Source Selector */}
      <SourceSelector
        selectedSource={selectedSource}
        setSelectedSource={setSelectedSource}
        userSources={userSources}
      />

      {/* Loading State */}
      {loading && currentNews.length === 0 && (
        <div className="text-center text-gray-400 mt-10">Loading news...</div>
      )}

      {/* Empty State */}
      {!loading && userSources.length > 0 && currentNews.length === 0 && (
        <div className="text-center text-gray-500 text-lg mt-10">
          {selectedSource
            ? `No news found for ${selectedSource}`
            : "No news available."}
        </div>
      )}

      {/* News List */}
      {currentNews.length > 0 && (
        <div className="space-y-6 mt-6">
          {currentNews.map((item, index) => (
            <NewsCard key={index} news={item} />
          ))}
        </div>
      )}

      {/* Settings Modal */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        userSources={userSources}
        setUserSources={(sources) => {
          setUserSources(sources);
          localStorage.setItem("userSources", JSON.stringify(sources));
        }}
      />

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
        <span className="inline-flex items-center gap-1">
          Made with
          <span className="text-red-500">
            <Heart className="w-4 h-4 inline-block" fill="currentColor" />
          </span>
          by{" "}
          <span className="font-medium text-gray-800 dark:text-gray-200">
            Nabaraj Bhandari
          </span>
        </span>
      </div>
    </main>
  );
}
