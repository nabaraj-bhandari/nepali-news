import { News } from "@/types/types";

export default function NewsCard({ news }: { news: News }) {
  return (
    <article className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-gray-900">
      {/* Title */}
      <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
        {news.title}
      </h2>

      {/* Description */}
      {Array.isArray(news.description) && news.description.length === 1 ? (
        <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
          {news.description[0]}
        </p>
      ) : (
        <ul className="list-none list-outside text-gray-700 dark:text-gray-300 my-2 leading-relaxed">
          {(news.description || []).map((sentence: string, idx: number) => (
            <li
              key={idx}
              className="relative pl-6 mb-2 before:content-['→'] before:absolute before:left-0 before:top-0 before:w-4"
            >
              {sentence}
            </li>
          ))}
        </ul>
      )}

      {/* Footer */}
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
