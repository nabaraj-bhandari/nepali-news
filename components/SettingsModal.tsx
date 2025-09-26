// components/SettingsModal.tsx
"use client";

import { useEffect } from "react";
import { SITE_CONFIGS, DEFAULT_SOURCE_NAMES } from "@/config/sources";
import { X } from "lucide-react";
import { SettingsModalProps } from "@/types/types";

export default function SettingsModal({
  isOpen,
  onClose,
  userSources,
  setUserSources,
}: SettingsModalProps) {
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

  const toggleSource = (source: string) =>
    setUserSources(
      userSources.includes(source)
        ? userSources.filter((s) => s !== source)
        : [...userSources, source],
    );
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white p-6 rounded-2xl shadow-xl relative max-h-[90vh] w-[90vw] overflow-y-auto transition-all duration-200">
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
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Manage Sources
            </span>
            <div className="space-x-2">
              <button
                className="px-3 pt-2 pb-1 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                onClick={() => setUserSources(allSources)}
              >
                Select All
              </button>
              <button
                className="px-3 pt-2 pb-1 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                onClick={() => setUserSources([])}
              >
                Reset
              </button>
            </div>
          </div>

          {/* Source Grid */}
          <div className="grid grid-cols-2 gap-3">
            {allSources.map((source) => (
              <button
                key={source}
                className={`px-4 pt-3 pb-2 rounded-lg text-sm font-medium border transition-all duration-200 ${
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
      </div>
    </div>
  );
}
