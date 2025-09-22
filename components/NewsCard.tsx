import { News } from "@/types/types";

export default function NewsCard({ news }: { news: News }) {
  return (
    <article className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-gray-900">
      {/* Title */}
      <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
        {news.title}
      </h2>

      {/* Author and Date */}
      <div className="text-sm text-gray-500 dark:text-gray-400 mb-3 flex flex-wrap gap-2">
        {news.author ? (
          <span>{news.author}</span>
        ) : (
          <span className="italic">Unknown</span>
        )}
        {news.date && <span>• {news.date}</span>}
      </div>

      {/* Description */}
      <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
        {news.description}
      </p>

      {/* Footer */}
      <div className="text-sm flex items-center justify-between">
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
