// components/SettingsModal.tsx
"use client";

import { useEffect, useState } from "react";
import { SITE_CONFIGS, DEFAULT_SOURCE_NAMES } from "@/config/sources";
import { Loader2, RefreshCw, Info, X } from "lucide-react";
import { SettingsModalProps } from "@/types/types";

const MAX_REQUESTS_PER_HOUR = 1;

export default function SettingsModal({
  isOpen,
  onClose,
  userSources,
  setUserSources,
}: SettingsModalProps) {
  const [loading, setLoading] = useState(false);
  const [userRequests, setUserRequests] = useState<number[]>([]);
  const allSources = SITE_CONFIGS.map((s) => s.name);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (userSources.length === 0) {
      const defaultSources = SITE_CONFIGS.filter((site) =>
        DEFAULT_SOURCE_NAMES.includes(site.name),
      ).map((site) => site.name);

      setUserSources(defaultSources);
      localStorage.setItem("userSources", JSON.stringify(defaultSources));
    }
  }, [userSources, setUserSources]);

  useEffect(() => {
    const stored = localStorage.getItem("userRequests");
    if (stored) setUserRequests(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("userRequests", JSON.stringify(userRequests));
  }, [userRequests]);

  const cleanOldRequests = (timestamps: number[]) =>
    timestamps.filter((ts) => ts > Date.now() - 20 * 60 * 1000);

  const canRequest =
    cleanOldRequests(userRequests).length < MAX_REQUESTS_PER_HOUR;

  const toggleSource = (source: string) =>
    setUserSources(
      userSources.includes(source)
        ? userSources.filter((s) => s !== source)
        : [...userSources, source],
    );

  const handleRequestLatest = async () => {
    if (!canRequest)
      return alert(`Limit reached (${MAX_REQUESTS_PER_HOUR} per hour).`);

    try {
      setLoading(true);
      const res = await fetch("/api/requestCount", { method: "POST" });
      if (!res.ok) throw new Error("Failed to request latest news");
      const updated = cleanOldRequests([...userRequests, Date.now()]);
      setUserRequests(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white p-6 rounded-2xl w-full max-w-md shadow-xl relative max-h-[90vh] overflow-y-auto transition-all duration-200">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 sticky top-0 bg-white dark:bg-gray-900 pb-2 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-semibold">Settings</h2>
          <button
            className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Manage Sources Section */}
        <div className="space-y-3 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Manage Sources
            </span>
            <div className="space-x-2">
              <button
                className="px-3 py-1.5 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                onClick={() => setUserSources(allSources)}
              >
                Select All
              </button>
              <button
                className="px-3 py-1.5 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                onClick={() => setUserSources([])}
              >
                Reset
              </button>
            </div>
          </div>

          {/* Source Grid */}
          <div className="grid grid-cols-2 gap-2">
            {allSources.map((source) => (
              <button
                key={source}
                className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all duration-200 ${
                  userSources.includes(source)
                    ? "bg-blue-600 border-blue-500 text-white shadow-sm"
                    : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
                onClick={() => toggleSource(source)}
              >
                {source}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-between">
          {/* Info Section */}
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <Info className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            <p className="pt-1.5">
              {canRequest
                ? "Request will trigger scraping."
                : "Request already sent."}
            </p>
          </div>

          {/* Request News Button */}
          <button
            onClick={handleRequestLatest}
            disabled={loading || !canRequest}
            className={`flex items-center justify-center gap-2 px-2 py-1 rounded-lg font-medium text-sm transition-all duration-200 shadow-sm ${
              loading || !canRequest
                ? "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            <span className="flex items-center">
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
            </span>
            <span className="flex items-center leading-none pt-1">
              {loading ? "Processing..." : "Request"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
