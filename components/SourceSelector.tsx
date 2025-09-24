// components/SourceSelector.tsx
"use client";

import { useEffect, useMemo } from "react";
import { SITE_CONFIGS } from "@/config/sources";
import { SourceSelectorProps } from "@/types/types";

export default function SourceSelector({
  selectedSource,
  setSelectedSource,
  userSources,
}: SourceSelectorProps) {
  const filteredSources = useMemo(
    () => SITE_CONFIGS.filter((s) => userSources.includes(s.name)),
    [userSources],
  );

  useEffect(() => {
    if (
      filteredSources.length > 0 &&
      !filteredSources.some((s) => s.name === selectedSource)
    ) {
      setSelectedSource(filteredSources[0].name);
    }
  }, [filteredSources, selectedSource, setSelectedSource]);

  if (userSources.length === 0) {
    return (
      <div className="text-center text-gray-400 mt-4">
        No sources selected. Please enable sources in Settings.
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl p-3 shadow-sm">
      <div className="flex flex-wrap gap-2">
        {filteredSources.map((source) => {
          const isSelected = selectedSource === source.name;
          return (
            <button
              key={source.name}
              onClick={() => setSelectedSource(source.name)}
              className={`px-4 py-1 pt-2 text-sm font-medium rounded-full transition-all duration-200
                ${
                  isSelected
                    ? "bg-yellow-400 text-black shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
            >
              {source.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
