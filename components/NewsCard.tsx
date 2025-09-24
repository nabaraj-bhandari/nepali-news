// components/NewsCard.tsx

import { News } from "@/types/types";

export default function NewsCard({ news }: { news: News }) {
  return (
    <article className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-gray-900">
      <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
        {news.title}
      </h2>
      <div className="text-xs flex items-center justify-between pt-2">
        <span className="text-gray-500 dark:text-gray-400">
          Source: <strong>{news.source}</strong>
        </span>
        <a
          href={news.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
        >
          Read more →
        </a>
      </div>
    </article>
  );
}
