import { News } from "@/types/types";

export default function NewsCard({ news }: { news: News }) {
  return (
    <article className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition">
      <h2 className="text-xl font-semibold mb-2">{news.title}</h2>

      <div className="text-sm text-gray-300 mb-2">
        {news.date && news.author ? (
          <span>
            {" "}
            {news.author} | {news.date}
          </span>
        ) : (
          <span>No date/author</span>
        )}
      </div>

      <p className="text-gray-400 mb-3">{news.description}</p>
      <div className="text-sm flex justify-between">
        <span className="text-gray-300">Source: {news.source}</span>
        <a
          href={news.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-blue-600 hover:underline"
        >
          Read more →
        </a>
      </div>
    </article>
  );
}
